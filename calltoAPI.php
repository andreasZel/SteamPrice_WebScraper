<?php
    if (isset($_REQUEST['game'])) {
        $command = escapeshellcmd('C:\Python310/python.exe find_prices.py '.$_REQUEST["game"]);
        $output = shell_exec($command);
        echo $output;
    }
?>