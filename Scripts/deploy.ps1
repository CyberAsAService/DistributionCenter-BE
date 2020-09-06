<insert args here>
[Net.ServicePointManager]::SecurityProtocol = 'Tls'
[bool] $downloaded = $false
if($PSVersionTable.PSVersion.Major -gt 2)
{
    
    try{
        Invoke-WebRequest -Uri $downloadUrl -OutFile $output
        [bool] $downloaded = $true
        Write-host("Download Completed")
        try{
            $postParams = @{package='test';status='success'}
            Invoke-WebRequest -Uri $uploadUrl -Method PATCH -Body $($postParams|ConvertTo-Json) -ContentType "application/json"
            Write-host("upload Completed")
            

        }
        catch
        {
            Write-host("Upload Failed")
            
        }
    }
    catch{
        Write-host("Download Failed")
        $postParams = @{package='test';status='failed'}
        Invoke-WebRequest -Uri $uploadUrl -Method PATCH -Body $($postParams|ConvertTo-Json) -ContentType "application/json"
    }
}
else{
    if($PSVersionTable.PSVersion.Major -eq 2)
    {
    $WebClient = New-Object System.Net.WebClient
    #Should we do Async download?
    try{
    $WebClient.DownloadFile($downloadUrl, $output)
    Write-host("Download Completed")
    [bool] $downloaded = $true
    try{
        $webClient.Headers.add('ContentType','application/json')
        $webClient.Headers.add('dataType','json')
        $postParams = New-Object System.Collections.Specialized.NameValueCollection
        $postParams.Add("package","test")
        $postParams.Add("status","success")
        $HtmlResult = $WebClient.UploadValues($uploadUrl, "PATCH", $postParams);
        Write-Host "Upload succeded"
        }
    catch
    {
        Write-Host "Upload failed"
    }
    }
    catch{
        try{
    Write-host("Download Failed")
        $webClient.Headers.add('ContentType','application/json')
        $webClient.Headers.add('dataType','json')
        $postParams = New-Object System.Collections.Specialized.NameValueCollection
        $postParams.Add("package","test")
        $postParams.Add("status","fail")
        $HtmlResult = $WebClient.UploadValues($uploadUrl, "PATCH", $postParams);
        write-host $HtmlResult
    }
            
    catch
    {
        Write-Host "Upload failed"
    }
        
    }}
}

Write-Host $downloaded
if($downloaded -eq $true)
{

    Write-Host "Opening downloaded file"
    start -FilePath $output
}