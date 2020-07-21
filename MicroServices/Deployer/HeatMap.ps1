        $jsons = [System.Collections.ArrayList]@()
        $pattern = "^([1-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])(\.([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])){3}$"
		# Get the output of netstat
		$data = netstat -nba
		
		# Keep only the line with the data (we remove the first lines)
		$data = $data[4..$data.count]
		# Each line need to be splitted and get rid of unnecessary spaces
        $count = 0
		foreach ($line in $data)
		{
			# Get rid of the first whitespaces, at the beginning of the line
			$line = $line -replace '^\s+', ''
			
			# Split each property on whitespaces block
			$line = $line -split '\s+'
			
            if($count%3 -eq 0)
            {
			# Define the properties
			$properties = @{
				Protocole = $line[0]
				LocalAddressIP = ($line[1] -split ":")[0]
				LocalAddressPort = ($line[1] -split ":")[1]
				ForeignAddressIP = ($line[2] -split ":")[0]
				ForeignAddressPort = ($line[2] -split ":")[1]
				State = $line[3]
                Process = ""
                
			}
        
           }
           else
            {
                if($line[0] -ne "TCP" -ne $line[0] -ne "UDP")
                {
                    $properties.process += $line[0]
                    #write-host $properties.process
                }
            }
           if($count%3 -eq 2)
           {
           
           	$sock = New-Object -TypeName PSObject -Property $properties		
			$jsock = New-Object -TypeName PSObject -Property $properties | ConvertTo-Json
            if( $sock.ForeignAddressIP -match $pattern -and $sock.ForeignAddressIP -notlike "127.0.0.1*" -and $sock.ForeignAddressIP -notlike "0.0.0.0*")
            {
                Write-Host $jsock
                $jsons.Add($jsock)
            }
            #if( $sock.LocalAddressIP -match $pattern -and $sock.LocalAddressIP -notlike "127.0.0.1*" -and $sock.LocalAddressIP -notlike "0.0.0.0*")
            #{
             #  New-Object -TypeName PSObject -Property $properties
            #}
           }
            $count ++;

		}
        $results = @"
                {
                "jsons":$jsons,
                }
"@
write-host $results["jsons"]

#TODO -> POST JSONS