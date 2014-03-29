import os

def test(f):
    return '_active.png' in f

def css(f):
    name = f.replace('_active.png', '')
    s = '.tile.%s {\n' % (name,)
    s += '  background-image: url("../images/%s_inactive.png");\n' % (name,)
    s += '}\n'
    s += '.tile.%s.activated {\n' % (name,)
    s += '  background-image: url("../images/%s_active.png");\n' % (name,)
    s += '}\n\n'
    return s
    
def main():
    with open('out.txt', 'w') as fout:
        for f in os.listdir('.'):
            if test(f):
                fout.write(css(f))

if __name__ == '__main__':
    main()
