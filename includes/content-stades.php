<div class="content">
    <div class="pnf">

        <div class="wrapper">
            <?php

            $statistiques = new DomDocument;
            $statistiques->validateOnParse = TRUE;
            $statistiques->load("statistiques.xml");

            $nom_club =$_GET['nom_club'];
            echo $nom_club;

            $clubs = $statistiques->getElementsByTagName("stats-club");
            $club = $statistiques->getElementById($nom_club);

            $picture = $club->getElementsByTagName("picture")->item(0)->nodeValue;
            $place = $club->getElementsByTagName("place")->item(0)->nodeValue;

            echo "<div class='title'><span>".$nom_club."</span></div>";
            echo"<div>";
            echo "<img src = ' ".$picture->item(1) -> getAttribute("path")."' />";
            echo"</div>";

            ?>

        </div>
    </div>
</div>


