<!DOCTYPE html>
<html>
	<head>
		<title>OBR | Map All</title>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
		<meta type="description" content="Map for generic transit">
		<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
		<meta http-equiv="Pragma" content="no-cache">
		<meta http-equiv="Expires" content="0">
		<link rel="preconnect" href="https://fonts.googleapis.com">
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
		<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Text:ital@0;1&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap" rel="stylesheet">
		<link rel="stylesheet" href="common/reset.css">
		<link rel="stylesheet" href="common/share.css">
		<link rel="stylesheet" href="common/map.css?<?php echo time(); ?>">
		<link rel="stylesheet" href="common/UI.css?<?php echo time(); ?>">
        <script src="https://unpkg.com/maplibre-gl@5.24.0/dist/maplibre-gl.js"></script>
		<link rel="stylesheet" href="https://unpkg.com/maplibre-gl@5.24.0/dist/maplibre-gl.css">
		<script src="https://cdn.jsdelivr.net/npm/@turf/turf@7/turf.min.js"></script>
		<style>

		</style>
	</head>
	<body>
		<div id="map_content">
            <div id="map"></div>
			<div id="mapContainer" class="lato-regular"></div>
		</div> 
		<script src="../common/util.js?<?php echo time(); ?>"></script>
		<script src="../common/UI.js?<?php echo time(); ?>"></script>
		<script src="../common/markers.js?<?php echo time(); ?>"></script>
		<script src="../common/map.js?<?php echo time(); ?>"></script>
		<script src="mapIndex.js?<?php echo time(); ?>"></script>
	</body>
</html>