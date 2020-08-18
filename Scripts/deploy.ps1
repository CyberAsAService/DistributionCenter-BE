if($PSVersionTable.PSVersion.Major -gt 2)
{
    try{
        Invoke-WebRequest -Uri $downloadUrl -OutFile $output
        Write-host("Download Completed")
        try{
            $PATCHParams = @{package='test';status='success'}
            Invoke-WebRequest -Uri $uploadUrl -Method PATCH -Body $($PATCHParams|ConvertTo-Json) -ContentType "application/json"
            Write-host("upload Completed")
        }
        catch
        {
            Write-host("Upload Failed")
        }
    }
    catch{
        Write-host("Download Failed")
        $PATCHParams = @{package='test';status='failed'}
        Invoke-WebRequest -Uri $uploadUrl -Method PATCH -Body $($PATCHParams|ConvertTo-Json) -ContentType "application/json"
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
        $PATCHParams = New-Object System.Collections.Specialized.NameValueCollection
        $PATCHParams.Add("package","test")
        $PATCHParams.Add("status","success")
        $WebClient.UploadValues("uploadUrl", "PATCH", $PATCHParams)
        Write-Host "Upload succeded"
   
        }
    catch
    {
        Write-Host "Upload failed"
    }
    }
    catch{
    Write-host("Download Failed")
        $webClient.Headers.add('ContentType','application/json')
        $webClient.Headers.add('dataType','json')
        $PATCHParams = New-Object System.Collections.Specialized.NameValueCollection
        $PATCHParams.Add("package","test")
        $PATCHParams.Add("status","fail")
        $HtmlResult = $WebClient.UploadValues($uploadUrl, "PATCH", $PATCHParams);
        write-host $HtmlResult
    }
        
    }
    else
    {
        #should never get here, as we have only windows 7+ in compliance, which has powershell v2 has default, but nth
        $job = bitsadmin /transfer myDownloadJob /download /priority normal $downloadUrl $output
        if ($job.Contains("Transfer"))
        {
            Write-host("Download Completed")
            #TODO -> send json as PATCH request(no invoke-webrequest as version < 2
        }
        else
        {
         Write-host("Download Failed, error is in $job")
            #TODO -> send json as PATCH request(no invoke-webrequest as version < 3
        }

    }
}
