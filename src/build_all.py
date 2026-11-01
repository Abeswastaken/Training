"""Build every trainer, then the public site.

Run from src/:  python3 build_all.py
- dist/<name>-trainer.html are the artifact pages (claude.ai, FB-Enable titles).
- dist/full*.html are standalone copies the tests in tests/ open (run them with cwd dist/).
- build_site.py turns dist/ into the published folders at the repo root.
oneoff/ holds scripts that were already applied once; do not rerun them.
"""
import os,subprocess,sys
here=os.path.dirname(os.path.abspath(__file__));os.chdir(here)
os.makedirs('dist',exist_ok=True)
def run(script,cwd='.'):
    print('==',script);subprocess.run([sys.executable,script],cwd=os.path.join(here,cwd),check=True)
for s in ['build.py','build_heat.py','build_ctl.py','build_wiring.py','build_ladder.py','build_vfd.py']:run(s)
run('patch.py','boiler')
run('build_site.py')
