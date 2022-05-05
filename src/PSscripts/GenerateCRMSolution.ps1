param(
    [Parameter(Mandatory)][String]$SolutionUniqueName,
    [Parameter(Mandatory)][String]$SchemaNameFile,
    [Parameter(Mandatory)][String]$PathToSolutionPack,
    [Parameter(Mandatory)][String]$ProductionJSPath
)

$path = "$PathToSolutionPack\Other"
If(!(test-path $path))
{
      New-Item -ItemType Directory -Force -Path $path
}
else{
Get-ChildItem -Path $path -Recurse | Remove-Item -force -recurse
}

$path2 = "$PathToSolutionPack\WebResources"
If(!(test-path $path2))
{
      New-Item -ItemType Directory -Force -Path $path2
}
else {
Get-ChildItem -Path $path2 -Recurse | Remove-Item -force -recurse
}


Try
{

$TemplateSolutionXML = "C:\CRMDeveloperTools\TmpSolution\TemplateSolution\Other\TemplateSolutionXML.xml"
$TemplateSolutionXMLSave = "$PathToSolutionPack\Other\Solution.xml"

#Copy empty Customizations.xml
Copy-Item "C:\CRMDeveloperTools\TmpSolution\TemplateSolution\Other\Customizations.xml" "$PathToSolutionPack\Other\Customizations.xml"

# Create a XML document
[xml]$xmlDoc = New-Object system.Xml.XmlDocument

# Read the existing file
[xml]$xmlDoc = Get-Content $TemplateSolutionXML
 
#Set solution name
$xmlDoc.ImportExportXml.SolutionManifest.UniqueName = $SolutionUniqueName

# Create nwe element and set attributes
$LocalizedName1 = $xmlDoc.CreateElement("LocalizedName")

$LocalizedName1.SetAttribute("description","!$SolutionUniqueName")
$LocalizedName1.SetAttribute("languagecode","1033")
$xmlDoc.ImportExportXml.SolutionManifest.LocalizedNames.AppendChild($LocalizedName1)
        
 #RootComponent
 # Create nwe element and set attributes
$RootComponent1 = $xmlDoc.CreateElement("RootComponent")

$RootComponent1.SetAttribute("type","61")
$RootComponent1.SetAttribute("schemaName","$SchemaNameFile")
$RootComponent1.SetAttribute("behavior","0")
$xmlDoc.ImportExportXml.SolutionManifest.RootComponents.AppendChild($RootComponent1)
 
Write-Host "Complete, saving xml $SolutionUniqueName"
$xmlDoc.Save($TemplateSolutionXMLSave)
  
}
Catch
{
    # Catch any error
   Write-Host $_.Exception.Message -ForegroundColor Red
}



Try {
$TemplateJsXML = "C:\CRMDeveloperTools\TmpSolution\TemplateSolution\WebResources\TemplateJsXML.xml"
$TemplateJsXMLSave = "$PathToSolutionPack\WebResources\$SchemaNameFile.data.xml"

$newGuid = New-Guid  
$uniqueNameFile = $SchemaNameFile+$newGuid

# Create a XML document
[xml]$xmlDocTemplateFile = New-Object system.Xml.XmlDocument

# Read the existing file
[xml]$xmlDocTemplateFile = Get-Content $TemplateJsXML
  
  $xmlDocTemplateFile.WebResource.WebResourceId = "{$newGuid}"
  $xmlDocTemplateFile.WebResource.Name = "$SchemaNameFile"
  $xmlDocTemplateFile.WebResource.DisplayName = "$SchemaNameFile"
  $xmlDocTemplateFile.WebResource.Description = "$SchemaNameFile"
  $xmlDocTemplateFile.WebResource.FileName = $xmlDocTemplateFile.WebResource.FileName.Replace("UniqueNameWithUniqueIDFile","$uniqueNameFile")

Write-Host "Complete, saving xml $SchemaNameFile"
$xmlDocTemplateFile.Save($TemplateJsXMLSave)
  
}
catch 
{
    # Catch any error
   Write-Host $_.Exception.Message -ForegroundColor Red
}

Try {

Get-ChildItem -Path $ProductionJSPath -Filter *.js -Recurse -File -Name| Sort-Object Length | ForEach-Object {
 
  $joinPath = Join-Path -Path  $ProductionJSPath -ChildPath $_
  $item  = Get-Item ($joinPath | Resolve-Path).Path
  $volume = Get-Volume $item.PSDrive.Name
  $ItemLenthMB = $item.Length / 1000/1000
 
  
  if($ItemLenthMB -gt 1)
  {
    Write-Host 'ItemFullPath:'$item '|LengthByte:' $item.Length '|LengthMB:' $ItemLenthMB  'ShortPath:'$_ '|ProductionPath:' $ProductionJSPath '|JoinedPath:'$joinPath
    Copy-Item "$item"  "$PathToSolutionPack\WebResources\$SchemaNameFile"
  }

}

}
catch
{    
# Catch any error
   Write-Host $_.Exception.Message -ForegroundColor Red
}