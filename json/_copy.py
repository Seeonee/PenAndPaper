import os
import re
import shutil
import subprocess

DOWNLOADS = r'C:\Users\Kevin\Downloads'
PATTERN = re.compile(r'(.*) \((\d+)\)\.json')
# PATTERN = re.compile('(.*) .(\d+).\.json')

def work(files):
    keep = {}
    for file in files:
        revision = 0
        name = file
        if '(' in file:
            m = PATTERN.match(file)
            name = m.group(1) + '.json'
            revision = int(m.group(2))
        if name not in keep:
            keep[name] = revision
        if keep[name] < revision:
            keep[name] = revision
    for (name, revision) in keep.items():
        src = name
        dst = name
        if revision != 0:
            src = name.replace('.json', ' (%d).json' % (revision,))
        shutil.move(os.path.join(DOWNLOADS, src), dst)
    for file in files:
        fullpath = os.path.join(DOWNLOADS, file)
        if os.path.exists(fullpath):
            os.remove(fullpath)

def main():
    files = [file for file in os.listdir(DOWNLOADS) if '.json' in file]
    work(files)
    subprocess.call('python _index.py', shell=True)

if __name__ == '__main__':
    main()
