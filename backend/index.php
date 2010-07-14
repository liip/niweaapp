<?php

ini_set("display_errors", 1);
error_reporting (E_ALL);

header("Content-Type: application/json");

class tagiProxy {

	private $catfeed = "http://www.tagesanzeiger.ch/mobile/ipad.html?pw=Iatgof100&amp;type=category&amp;ipad=1&amp;category_id=";
	private $storyfeed = "http://www.tagesanzeiger.ch/mobile/feed.html?pw=Iatgof100&type=story&story_id=";
	private $categoryIds = array(0,1,2,3,4,5,6,7,4269);
	private $errors = array("noid" => "no category id given!", "invalidid" => "invalid category id");
	public $id;
	public $mode;
	private $rss;
	private $items = array();
	
	public function getJsonByCategoryId($id, $mode){
		if($this->parseInput($id, $mode)){			
			$this->getRssByCategoryId($this->id, $this->mode);	
		}		
	}
	
	private function parseInput($id, $mode){
		// id check
		if(!isset($id)){
			$this->throwError("noid");
			return false;
		}
		
		if(!is_numeric($id)){
			$this->throwError("invalidid");
			return false;
		}
		
		$this->id = $id = intval($_GET['id']);
		
		// mode check		
		switch ($mode) {
		case "story":
			$this->mode = "story";
			break;
		case "cat":
			$this->mode = "cat";
			break;
		default: return false;
		}
		return true;
		
	}
	
	
	private function getRssByCategoryId(){		
		
		$feedvar = $this->mode."feed";
		$this->rss = simplexml_load_file("{$this->$feedvar}{$this->id}");
		$this->rss2Array();
		
		// header("Content-type: application/json");
		echo $this->array2Json();
	}
	
	
	private function array2Json(){
		$overall = array();
		$overall['id'] = $this->id;
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
		// header("HTTP/1.0 404 Not Found");  
	}
	

};

$tagiProxy = new tagiProxy();
$tagiProxy->getJsonByCategoryId($_GET['id'], $_GET['mode']);





