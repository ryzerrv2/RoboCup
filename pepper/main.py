import requests, json
from pprint import pprint

GetData = requests.get('http://localhost/RoboCup/hosting/script.php');
DataToAppend = GetData.json()

if("ErrorMessage" not in DataToAppend):
	file = open("registry.json", "r")
	print(file.read())
	RegData = json.loads(file.read()) if file.read() else [] 
	file.close()

	with open("registry.json", "w+") as file:
		for User in DataToAppend:
			RegData.append(User)
		json.dump(RegData, file, indent=4)
else:
	print(DataToAppend)