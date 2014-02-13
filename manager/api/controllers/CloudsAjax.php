<?php

class CloudsAjax {
    private $fields = array(
        "state"               => "State",
        "id"                  => "ID",
        "instance_type"       => "Instance Type",
        "key_name"            => "Key Name",
        "private_ip_address"  => "Private IP",
        "publicIp"            => "Public IP",
        "architecture"        => "Architecture",
        "attachTime"          => "AttachTime",
        "attachmentId"        => "AttachmentId",
        "client_token"        => "Client token",
        "deleteOnTermination" => "Delete On Termination",
        "description"         => "Description",
        "dns_name"            => "DNS Name",
        "groups"              => "Groups",
        "hypervisor"          => "Hypervisor",
        "image_id"            => "Image ID",
        "ipOwnerId"           => "Ip Owner ID",
        "ip_address"          => "ip Address",
        "kernel"              => "Kernel",
        "launch_time"         => "Launch Time",
        "networkInterfaceId"  => "Network Interface ID",
        "ownerId"             => "Owner ID",
        "platform"            => "Platform",
        "private_dns_name"    => "Private DNS Name",
        "public_dns_name"     => "Public DNS Name",
        "reason"              => "Reason",
        "root_device_name"    => "Root Device Name",
        "root_device_type"    => "Root Device Type",
        "sourceDestCheck"     => "Source Dest Check",
        "status"              => "Status",
        "subnet_id"           => "Subnet ID",
        "tenancy"             => "Tenancy",
        "virtualization_type" => "Virtualization Type",
        "vpc_id"              => "VPC ID"
        );

    /************* VM ***************/

    public function instanceByCloudAccountId($data)
    {
        if (isset($data->id))
        {
            if (isset($_SESSION['cloudaccountsbyid'][$data->id]) and !empty($_SESSION['cloudaccountsbyid'][$data->id]))
            {
                $cloudaccounts = $_SESSION['cloudaccountsbyid'][$data->id];
                $curl = new Curl(URL_API . "vm/" . $data->id . "/list");
                $response = $curl->get();
                $response = json_decode($response, true);
                if (isset($response->error)) {
                    header("HTTP/1.0 ". $response->error);
                } else {
                    unset($response['success']);
                    $result = array(
                        'id' => $data->id,
                        'cloudname' => $cloudaccounts['cloudname'],
                        'cloudaccountname' => $cloudaccounts['cloudaccountname'],
                        'vms' => $this->fillTableVm($response['vms']),
                        'fields' => $this->fields
                    );
                    echo json_encode($result);
                }
            }
        } else {
            echo "coucou";
        }
    }
    private function fillTableVm($table_vm)
    {
        foreach ($table_vm as &$vm)
        {
            if (sizeof($vm) != 0)
            {
                foreach ($vm as $key => &$value)
                {
                    foreach ($this->fields as $field_key => $field_value)
                    {
                        if (!array_key_exists($field_key, $value))
                            $value['' . $field_key] = "";
                    }
                }
            }
        }
        return $table_vm;
    }
}
?>