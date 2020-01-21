<?php
    header("Access-Control-Allow-Origin: *");    
	include('datamodel.php');	
	include('dbinfo.php');
	$seq = "";
    $type = "";
	$value = "";
	$cate = "";
    $returnObj = new ReturnObj;
    $info = new DBInfo;
    
	if(isset($_REQUEST['seq'])){
		$seq=$_REQUEST['seq'];
	}

	if(isset($_REQUEST['cate'])){
		$cate=$_REQUEST['cate'];
	}

	if(isset($_REQUEST['value'])){
		$value=(double)$_REQUEST['value'];
	}
	
	if($seq == ""){
        $returnObj->msg = " seq not set!";
	} 
	if($cate == ""){
        $returnObj->msg = " cate not set!";
	} 
	if($value == ""){
	    $returnObj->msg = " value not set!";
	} 

	$dbc = mysqli_connect($info->host , $info->dbID , $info->dbPW);
    
    if(!$dbc)
    {
	    $returnObj->msg = " connect fail!";
		echo json_encode($returnObj);
        return;	
	}

	$result = mysqli_select_db($dbc, $info->dbTable);
   
    
	$sql = "CREATE TABLE IF NOT EXISTS ".$cate." (
										id INT(6) UNSIGNED AUTO_INCREMENT,
										seq VARCHAR(60) NOT NULL,
										value DOUBLE,
										reg_date TIMESTAMP,
										PRIMARY KEY (`seq`),
										UNIQUE (`id`),
										INDEX (`value`)
								  )ENGINE = InnoDB";

	$result = mysqli_query($dbc,$sql);
    if(!$result){
	    $returnObj->msg .= " create table fail : ".$sql;
		echo json_encode($returnObj);
		mysqli_close($dbc);
        return;	
	}

	$sql = "SELECT * FROM `".$cate."` WHERE `seq`='".$seq."' LIMIT 0,1";
	$result = mysqli_query($dbc,$sql);
	if($result)
	{
		$isUpdate = false;
        $row = mysqli_fetch_assoc($result);

        if($row['value']!=null)
        {
        	$score = $row['value'];
        	$returnObj->msg .= "& exist score ".$score;
        	if($score < $value)
        	{
        		$isUpdate = true;
        		$sql = "UPDATE ".$cate." SET `value`='".$value."' WHERE `seq`='".$seq."';";
        	}
		}
		else
		{
			$isUpdate = true;
			$sql = 'INSERT INTO `'.$cate.'` (`id`,`seq`,`value`,`reg_date`) VALUES (NULL,\''.$seq.'\', \''.$value.'\', NOW());';  
		}


        if($isUpdate == false)
        {
        	$returnObj->resultCode = "0";
        }
        else
        {
        	
	        $result = mysqli_query($dbc,$sql); 
	        if(!$result)
	        {
				$returnObj->msg .= "& insert score fail";
			}
			else
			{
				$returnObj->msg .= "& insert score success";
				$returnObj->resultCode = "1";
			}
			
		}
	}
	else
	{
		$returnObj->msg .= " select value fail : ".$sql;
	}

    mysqli_close($dbc);
	echo json_encode($returnObj);
	
 ?>
