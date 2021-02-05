from ftplib import FTP
import re
import os

# pip install unrar
from unrar import rarfile


def get_file_name(p):
    return p.split('/')[-1]

def get_file_name_without_extension(p):
    return os.path.splitext(get_file_name(p))[0]

def get_file_version(name):
    name = get_file_name(name)
    sr = re.search(r'.*((\d+\.)(\d+\.)(\d+\.)(\d)).*', name)
    if sr is not None:
        version = sr.group(1)
        # print('file: '+name+', version: '+version)
        return version


def compare_version(a, b):
    sp_a = a.split('.')
    sp_b = b.split('.')
    for i in range(0, min(len(sp_a), len(sp_b))):
        if sp_a[i] != sp_b[i]:
            return int(sp_a[i]) - int(sp_b[i])
    return 0


def ftp_login(url):
    ftp = FTP(url)
    ftp.login()
    return ftp


def ftp_get_files(ftp, path, start):
    # files = []

    # def parse(p):
    #     print(p)
    #     file_name = p.split(' ')[-1]
    #     if file_name != '.' and file_name != '..':
    #         files.append(file_name)

    # ftp.cwd('Packages/rar_EDM_2/')
    # ftp.retrlines('LIST', parse)

    def name_filter(p):
        return get_file_name(p).startswith(start)

    files = ftp.nlst('Packages/rar_EDM_2/')

    if start is not None:
        files = filter(name_filter, files)

    return files


def ftp_is_file(ftp, name):
    try:
        ftp.cwd(name)
        # print('dir: '+name)
    except:
        return True
    else:
        # 打开路径没问题，类型是文件夹，返回上一级
        # ftp.cwd('..')
        ftp.cwd('/')
        return False


def get_latest_version_file(ftp, files):
    latestVersion = '0.0.0.0'
    latest = ''

    for name in files:
        if ftp_is_file(ftp, name):

            version = get_file_version(name)
            # print('file: '+name+', version: '+version)

            if version is not None:
                if compare_version(version, latestVersion) > 0:
                    latestVersion = version
                    latest = name

    return latest


def ftp_download(ftp, save_dir, name):
    if name != '':
        path = save_dir + get_file_name(name)   # 定义文件保存路径
        if os.path.isfile(path):
            print('file:'+path+' already exist')
        else:
            print('downloading: '+name)
            f = open(path, 'wb')   # 打开要保存文件
            filename = 'RETR ' + name   # 保存FTP文件
            ftp.retrbinary(filename, f.write)   # 保存FTP上的文件
            return path


def extract_rar(rar_file, to=None):

    rar = rarfile.RarFile(rar_file)

    if to == None:
        to = os.path.join(os.path.dirname(rar_file), get_file_name_without_extension(rar_file))

    rar.extractall(to)


def main():
    ftp = ftp_login('192.168.1.201')

    start_names = ['EDM Testing', 'Post Analyzer']

    for name in start_names:
        files = ftp_get_files(ftp, 'Packages/rar_EDM_2/', name)
        latest = get_latest_version_file(ftp, files)
        path = ftp_download(ftp, 'D:/EDM_Release/', latest)
        if path is not None:
            extract_rar(path)


main()
