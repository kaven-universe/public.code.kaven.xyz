from ftplib import FTP
import re
import os

ftp = FTP('192.168.1.201')
ftp.login()

files = []

def compare_version(a, b):
    sp_a = a.split('.')
    sp_b = b.split('.')
    for i in range(0, min(len(sp_a), len(sp_b))):
        if sp_a[i] != sp_b[i]:
            return int(sp_a[i]) - int(sp_b[i])
    return 0


# def parse(p):
#     print(p)
#     file_name = p.split(' ')[-1]
#     if file_name != '.' and file_name != '..':
#         files.append(file_name)

# ftp.cwd('Packages/rar_EDM_2/')
# ftp.retrlines('LIST', parse)

files = ftp.nlst('Packages/rar_EDM_2/')

latestVersion = '0.0.0.0'
latest = ''

for name in files:
    try:
        ftp.cwd(name)
        # print('dir: '+name)
    except:
        sr = re.search(r'.*((\d+\.)(\d+\.)(\d+\.)(\d)).*', name)
        if sr is not None:
            version = sr.group(1)
            # print('file: '+name+', version: '+version)

            if compare_version(version, latestVersion) > 0:
                latestVersion = version
                latest = name
    else:
        # 打开路径没问题，类型是文件夹，返回上一级
        # ftp.cwd('..')
        ftp.cwd('/')

print('latest: '+latest)

path = 'D:/EDM_Release/' + latest.split('/')[-1]   # 定义文件保存路径
if os.path.isfile(path):
    print('file already exist')
else:
    f = open(path, 'wb')   # 打开要保存文件
    filename = 'RETR ' + latest   # 保存FTP文件
    ftp.retrbinary(filename, f.write)   # 保存FTP上的文件
