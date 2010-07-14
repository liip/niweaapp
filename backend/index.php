<?php

ini_set("display_errors", 1);
error_reporting (E_ALL);



class tagiProxy {

	private $feed = "http://www.tagesanzeiger.ch/mobile/ipad.html?pw=Iatgof100&amp;type=category&amp;ipad=1&amp;category_id=";
	private $categoryIds = array(0,1,2,3,4,5,6,7,4269);
	private $errors = array("noid" => "no category id given!", "invalidid" => "invalid category id");
	public $catId;
	private $rss;
	private $items = array();
	
	public function getJsonByCategoryId($catId){
		if($this->parseInput($catId)){			
			$this->getRssByCategoryId($this->catId);	
		}		
	}
	
	private function parseInput($catId){
		
		if(!isset($catId)){
			$this->throwError("noid");
			return false;
		}
		
		else if(!is_numeric($catId)){
			$this->throwError("invalidid");
			return false;
		}
		
		else {
			$this->catId = $id = intval($_GET['catId']);	
		}
		return true;
		
	}
	
	
	private function getRssByCategoryId(){		
		$this->rss = simplexml_load_file("{$this->feed}{$this->catId}");
		$this->rss2Array();
		
		// header("Content-type: application/json");
		echo $this->array2Json();
	}
	
	
	private function array2Json(){
		$overall = array();
		$overall['catid'] = $this->catId;
		$overall['items'] = $this->items;		
		return(json_encode($overall));
	}
	
	private function rss2Array(){
		// vereinfachen, shorten
		
		foreach($this->rss->channel->item as $item){
			$lead = $item->lead;
			$shortlead = substr($lead, 0, 110)."...";
			
			$itm = array();
				foreach($item as $k => $v){
					$itm[$k] = trim((string)$v);
				}
			$itm['shortlead'] = $shortlead;
			array_push($this->items, $itm);
		}
		
		return($this->items);
	}
	
	private function throwError($key){
		// TODO 
		header("HTTP/1.0 404 Not Found");  
	}
	

};

$tagiProxy = new tagiProxy();
$tagiProxy->getJsonByCategoryId($_GET['catId']);





