param(
    [Parameter(Mandatory=$true)][string]$downloadUrl,
    [Parameter(Mandatory=$true)][string]$output,
    [Parameter(Mandatory=$true)][string]$uploadUrl
)
$start_time = Get-Date
if($PSVersionTable.PSVersion.Major -gt 2)
{
    
    try{
        Invoke-WebRequest -Uri $downloadUrl -OutFile $output
        Write-host("Download Completed")
        try{
            $postParams = @{package='test';status='success'}
            Invoke-WebRequest -Uri $uploadUrl -Method POST -Body $($postParams|ConvertTo-Json) -ContentType "application/json"
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
        Invoke-WebRequest -Uri $uploadUrl -Method POST -Body $($postParams|ConvertTo-Json) -ContentType "application/json"
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
        $WebClient.UploadValues("uploadUrl", "POST", $postParams)
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
        $postParams = New-Object System.Collections.Specialized.NameValueCollection
        $postParams.Add("package","test")
        $postParams.Add("status","fail")
        $HtmlResult = $WebClient.UploadValues($uploadUrl, "POST", $postParams);
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
            #TODO -> send json as post request(no invoke-webrequest as version < 2
        }
        else
        {
         Write-host("Download Failed, error is in $job")
            #TODO -> send json as post request(no invoke-webrequest as version < 3
        }

    }
}
Write-Output "Time taken: $((Get-Date).Subtract($start_time).Seconds) second(s)"