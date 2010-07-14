modules.story = {
    stub: '	 				<div class="story"> 					<h2 class="title">Beamte müssen iPhones abgeben</h2> 					<p class="lead">Schluss mit iPhones: In der ganzen Bundesverwaltung dürfen keine neuen mehr eingeführt werden. Mindestens in einer Abteilung wurden die Geräte von Apple sogar eingesammelt. Ein IT-Experte findet das Ansinnen widersinnig.</p> 					<img src="media/images/picture_big.jpg" alt="" />                     <div class="text"> 					<p>Auch bei den Bundesangestellten ist das iPhone ein Renner. 680 Mitarbeiter haben bei ihrem Arbeitgeber bereits eines bezogen, weil sie beruflich auf ein multifunktionales Mobiltelefon angewiesen sind. Die Nachfrage nach den praktischen und ästhetischen Geräten von Apple (AAPL 251.798 -2.13%) ist bei Bundesangestellten stark steigend.</p> 					<h3>Keine neuen iPhones mehr</h3> 					<p>Doch jetzt ist Schluss: Das Eidgenössische Finanzdepartement (EFD) hat entschieden, dass ab sofort in der ganzen Bundesverwaltung bis auf weiteres keine iPhones mehr bestellt und eingeführt werden dürfen. Das Bundesamt für Informatik wurde zudem explizit angewiesen, keine neuen Aufträge zur Synchronisierung von iPhones mit den EDV-Anlagen des Bundes anzunehmen. Das mobile Gerät von Apple kommt deshalb für all jene Bundesangestellte, die ein multifunktionales Handy für ihre Arbeit brauchen, nicht mehr in Frage. EFD-Sprecher Roland Meier bestätigt Recherchen dieser Zeitung. Bis auf weiteres können Bundesangestellte nur noch Smartphones anderer Marken bestellen und mit der EDV des Bundes verbinden.</p>                     </div> 			<div class="recent_stories"> </div><div class="context_stories"> </div> 	</div> 		', 
    init: function(data) {
		NIWEA.Storage.updateStory(data.id.replace(/story_/,''));
	}

}


modules.category = {
	stub: '<div class="story big">					<img width="640" height="385" src="" alt="" />					<h2 class="title">Beamte müssen iPhones abgeben</h2>					<p class="lead">Schluss mit iPhones: In der ganzen Bundesverwaltung dürfen keine neuen mehr eingeführt werden. Mindestens in einer Abteilung wurden die Geräte von Apple sogar eingesammelt. Ein IT-Experte findet das Ansinnen widersinnig.</p>				</div>				<div class="story small">					<h2 class="title">Die Spitze der ’Ndrangheta ist kaltgestellt</h2>					<p class="lead">Italiens Polizei hat über 300 Mitglieder der kalabresischen Mafia verhaftet, auch die Nummer eins.</p>				</div>				<div class="story small">					<h2 class="title">Neues Dokument belastet Minister Woerth</h2>					<p class="lead">Am Montagabend hatte Frankreichs Präsident Sarkozy seinen umstrittenen Arbeitsminister Eric Woerth als «zutiefst…</p>				</div>				<div class="story small">					<h2 class="title">Die Spitze der ’Ndrangheta ist kaltgestellt</h2>					<p class="lead">Italiens Polizei hat über 300 Mitglieder der kalabresischen Mafia verhaftet, auch die Nummer eins.</p>				</div>				<div class="story small">					<h2 class="title">Die Spitze der ’Ndrangheta ist kaltgestellt</h2>					<p class="lead">Italiens Polizei hat über 300 Mitglieder der kalabresischen Mafia verhaftet, auch die Nummer eins.</p>				</div>',
	 init: function(data) {
		 if (!data.id) {
			 data.id = 0;
		 }
		NIWEA.Storage.updateCategory(data.id);
	}
}
	
