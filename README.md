# Lost Target Search


![Lost Target Search In One Glance](./web/static/img/3_panel_together.png?raw=true)
`
### Link To Website
<a href="https://lost-target-search.herokuapp.com" target="_blank" rel="noopener">Go To Lost Target Search!</a>

### Running The Project

Clone the project
```
git clone https://github.com/Sthitadhee/lost-target-search.git
```

Create and run a virtual environment
```
python -m venv venv
source venv/bin/activate (mac)
source venv/Scripts/activate (windows)
```

Install the correct python packages
```
pip install -r requirement.txt
```

Run flask
```
cd app/
flask run
```



### File Directory Overview

```
PROJECT OPTIMIZATION TECHNIQUE/
|-- app/
|   |-- app.py
|
|-- web/
|   |-- static/
|   |   |-- css/
|   |   |   |-- bootstrap.min.css
|   |   |   |-- bootstrap.min.css.map
|   |   |   |-- style.css
|   |   |
|   |   |-- img/
|   |   |   |-- glyph-icons-settings-png
|   |   |
|   |   |-- js/
|   |   |   |-- helper.js
|   |   |   |-- map.js
|   |   |   |-- matlab.func.js
|   |   |   |-- mpso.js
|   |   |   |-- simulation.js
|   |   |   |-- variable.js
|   |   |
|   |
|   |-- templates/
|   |   |-- index.html
|   |
|
|-- venv
|-- README.md
|-- .gitignore
```