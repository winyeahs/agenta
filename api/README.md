conda create -n agent python=3.12
conda activate agent

python -m venv .venv
.venv\Scripts\activate.bat
pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple

pip freeze > requirements.txt

# Run migrate
python -m flask db upgrade

# Start backend
python -m flask run --host 0.0.0.0 --port=5001 --debug