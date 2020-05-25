initVariables () {
	saoNumber=$1
	path="/d/dmartinez/InfoSaos/$saoNumber/entrega"
	deliveryPath="/d/dmartinez/entregas/SAO$saoNumber/Apogeo/PortalServer"
	sourcePortalPath="/d/dmartinez/repos_entregas/eportal"
	sourceBroadbandPath="/d/dmartinez/repos_entregas/broadbandsale"
}
initVariables $@
#Unzip de artefactos descargados del sao y borrado de precache
cd $deliveryPath
unzip -q \*.zip
rm *.zip
#Navegar a carpetas para borrar precache en eportal y broadband
cd ./webapps/react/master
ls | grep -P "^precache.*js"| xargs -d"\n" rm
cd ./broadband
ls | grep -P "^precache.*js"| xargs -d"\n" rm

# #Unzip de artefactos compilados para la entrega
cd $path
unzip -q \*.zip
rm *.zip
#Copiar artefactos compilados en carpeta de entrega del sao
cp -rT qa_deploy_broadband/ $deliveryPath/webapps/react/master/broadband/
cp -rT qa_deploy_osfportal/ $deliveryPath/webapps/react/master/

#Actualizar codigo fuente y copiarlo en source front portal
cd $sourceBroadbandPath
git checkout master
git pull
git submodule update --remote
cp -rT . $deliveryPath/source-front-portal/eportal/ePortalApps/broadbandsale
 
cd $sourcePortalPath
git checkout master
git pull
git submodule update --remote
cp -rT ePortalClient/ $deliveryPath/source-front-portal/eportal/ePortalClient

#eliminar .git al terminar
cd $deliveryPath/source-front-portal/eportal/ePortalApps/broadbandsale
rm -rf .git/

#crear zips de entrega
cd $deliveryPath
zip -r -q front-portal.zip webapps 
zip -r -q source-front-portal.zip source-front-portal 

#borrar carpetas 
rm -rf source-front-portal webapps


