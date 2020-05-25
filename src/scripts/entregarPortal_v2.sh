initVariables () {
	saoNumber=$1
	processPortal=$2
	processBroadband=$3
	path="/d/dmartinez/InfoSaos/$saoNumber/entrega"
	deliveryPath="/d/dmartinez/entregas/SAO$saoNumber/Apogeo/PortalServer"
	sourcePortalPath="/d/dmartinez/repos_entregas/eportal"
	sourceBroadbandPath="/d/dmartinez/repos_entregas/broadbandsale"
}

processPortal () {
	echo "Procesar eportal"
	cd $deliveryPath
	cd ./webapps/react/master
	echo "Borrando precache"
	ls | grep -P "^precache.*js"| xargs -d"\n" rm
	cd $path
	echo "Copiando compilados de eportal a carpeta de entrega del SAO"
	cp -rT qa_deploy_osfportal/ $deliveryPath/webapps/react/master/
	echo "Copiando fuentes de eportal a carpeta de entrega del SAO"
	cd $sourcePortalPath
	git checkout master
	git pull
	git submodule update --remote
	cp -rT ePortalClient/ $deliveryPath/source-front-portal/eportal/ePortalClient
}

processBroadband () {
	echo "Procesar broadband"
	cd $deliveryPath
	cd ./webapps/react/master/broadband
	echo "Borrando precache"
	ls | grep -P "^precache.*js"| xargs -d"\n" rm
	cd $path
	echo "Copiando compilados de broadband a carpeta de entrega del SAO"
	cp -rT qa_deploy_broadband/ $deliveryPath/webapps/react/master/broadband/
	echo "Copiando fuentes de broadband a carpeta de entrega del SAO"
	cd $sourceBroadbandPath
	git checkout master
	git pull
	git submodule update --remote
	cp -rT . $deliveryPath/source-front-portal/eportal/ePortalApps/broadbandsale
	#eliminar .git al terminar
	echo "Borrar carpeta de git"
	cd $deliveryPath/source-front-portal/eportal/ePortalApps/broadbandsale
	rm -rf .git/
	rm -rf .git
}

initVariables $@

#Unzip de artefactos descargados del sao
echo "Descomprimiendo artefactos descargados del SAO"
cd $deliveryPath
unzip -q \*.zip
rm *.zip

# Unzip de artefactos compilados para la entrega
cd $path
echo "Descomprimiendo artefactos de la entrega"
unzip -q \*.zip
rm *.zip

if [[ $processPortal == 1 ]]; then
	processPortal
fi

if [[ $processBroadband == 1 ]]; then
	processBroadband
fi

#crear zips de entrega
echo "Crear zips de entrega"
cd $deliveryPath
zip -r -q front-portal.zip webapps 
zip -r -q source-front-portal.zip source-front-portal 
#borrar carpetas 
rm -rf source-front-portal webapps


