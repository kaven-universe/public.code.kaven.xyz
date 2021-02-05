import os

'''get current dir'''
dir_path = os.path.dirname(os.path.realpath(__file__))

'''list files'''
file_name = os.listdir(dir_path)

'''save to txt'''
with open(os.path.join(dir_path, 'file-list.txt'), mode='wt', encoding='utf-8') as my_file:
    my_file.write('\n'.join(file_name))
