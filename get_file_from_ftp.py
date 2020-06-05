from ftplib import FTP
import re

ftp = FTP('192.168.1.201')
ftp.login()

ftp.cwd('Packages/rar_EDM_2/')

files = []


def parse(p):
    file_name = p.split(' ')[-1]
    if file_name != '.' and file_name != '..':
        files.append(file_name)


ftp.retrlines('LIST', parse)

latest = '0.0.0.0'

for name in files:
    try:
        ftp.cwd(name)
        # print('dir: '+name)
    except:
        sr = re.search(r'.*((\d+\.)(\d+\.)(\d+\.)(\d)).*', name)
        if sr is not None:
            version = sr.group(1)
            print('file: '+name+', version: '+version)

            if version > latest:
                latest=name
    else:
        # 打开路径没问题，类型是文件夹，返回上一级
        ftp.cwd('..')

print('latest: '+latest)