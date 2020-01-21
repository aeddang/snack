<?php
    header("Access-Control-Allow-Origin: *");        
	include('datamodel.php');	
	include('dbinfo.php');
	$seq = "";
    $type = "";
	$cate = "";
	$page=0;
	$size=100;
	$order="DESC";
    $returnObj = new ReturnObj;
    $info = new DBInfo;
    
	if(isset($_REQUEST['seq'])){
		$seq=$_REQUEST['seq'];
	}

	if(isset($_REQUEST['cate'])){
		$cate=$_REQUEST['cate'];
	}

	
	
	if($seq == ""){
        $returnObj->msg = " seq not set!";
	} 
	if($cate == ""){
        $returnObj->msg = " cate not set!";
	} 
	

	$dbc = mysqli_connect($info->host , $info->dbID , $info->dbPW);
    
    if(!$dbc)
    {
	    $returnObj->msg = " connect fail!";
		echo json_encode($returnObj);
        return;	
	}
	$result = mysqli_select_db($dbc, $info->dbTable);

	$return_arr = array();
	$myScore = 0;
	$myRank = 0;
	$bestScore = 0;
   	
   	$sNum = $page*$size;
   	$sql = "SELECT * FROM `".$cate."` ORDER BY `value` ".$order." LIMIT ".$sNum." , ".$size; 
	$result = mysqli_query($dbc,$sql);

	if(!$result)
	{

		$returnObj->msg .= " read list fail!";
		mysqli_close($dbc);
		echo json_encode($returnObj);
        return;	
	}
	else
	{
	    while ($row = mysqli_fetch_assoc($result)) {
			if($row['value']!=null)
			{
				if($bestScore == 0)
				{
					$bestScore = $row['value'];
				} 
                array_push($return_arr,$row['value']);
			}
		}
	}


    $sql = "SELECT * FROM `".$cate."` WHERE `seq`='".$seq."' LIMIT 0,1";
	$result = mysqli_query($dbc,$sql);
	if($result)
	{
		$row = mysqli_fetch_assoc($result);
        if($row['value']!=null)
        {
        	$myScore = $row['value'];
        	$key = array_search($myScore, $return_arr);
        	if($key != -1)
        	{
        		$myRank = $key+1;
        	}
		}
	}
	else
	{
		$returnObj->msg .= " select my value fail : ".$sql;
		mysqli_close($dbc);
		echo json_encode($returnObj);
        return;
	}
	mysqli_close($dbc);
	$returnObj->resultCode = "0";
	$resultValue = new RanklListObj;
	$resultValue->list = $return_arr;
	$resultValue->bestScore = (String)$bestScore;
	$resultValue->myScore = (String)$myScore;
	$resultValue->myRank = (String)$myRank;

	$returnObj->value = $resultValue;
    
	echo json_encode($returnObj);
	
 ?>
