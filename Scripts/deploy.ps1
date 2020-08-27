<insert args here>
[Net.ServicePointManager]::SecurityProtocol = 'Tls'

if($PSVersionTable.PSVersion.Major -gt 2)
{
    
    try{
        Invoke-WebRequest -Uri $downloadUrl -OutFile $output
        Write-host("Download Completed")
        try{
            $postParams = @{package='test';status='success'}
            Invoke-WebRequest -Uri $uploadUrl -Method PATCH -Body $($postParams|ConvertTo-Json) -ContentType "application/json"
            Write-host("upload Completed")
            Start-Process -FilePath $output

        }
        catch
        {
            Write-host("Upload Failed")
            Start-Process -FilePath $output
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
    try{
        $webClient.Headers.add('ContentType','application/json')
        $webClient.Headers.add('dataType','json')
        $postParams = New-Object System.Collections.Specialized.NameValueCollection
        $postParams.Add("package","test")
        $postParams.Add("status","success")
        $HtmlResult = $WebClient.UploadValues($uploadUrl, "PATCH", $postParams);
        Write-Host "Upload succeded"
        Start-Process -FilePath $output
        }
    catch
    {
        Write-Host "Upload failed"
        Start-Process -FilePath $output
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
