<div class="content">
    <div class="apropos">
        <div class="wrapper">
            <div class="a-left">
                <div class="apropos-title">
                    <h3>Statistiques de la saison 2015-2016</h3>
                    <div>
                        <ul>
                            <li><span>Les 20 stades de Ligue 1</span></li>
                            <div class="cls"> </div>
                        </ul>
                    </div>
                    <?php
                    $xml = new DomDocument;
                    $xml->load("datas/statistiques.xml");

                    $list_clubs = $xml->getElementsByTagName("stats-club");

                    echo"<table>";
                    echo"<tr>";
                    $i=0;
                    foreach($list_clubs as $club)
                    {
                        echo"<td>";
                        echo"<div>";

                        //Chemin des images
                        $list_pictures=$club->getElementsByTagName('picture');
                        //get the path from the pictures
                        foreach($list_pictures as $picture)
                        {
                            $path=$picture->getAttribute("path");
                        }

                        //Affiche les pictures
                        echo"<img src='".$path."' height=250px; width=200px; style='margin:6px 3px ; position:relative;'>";
                        $nom = $club->getAttribute("nom_club");

                        echo"<a href='stades.php?nom_club=".$nom."'>";
                        echo"</img></a>";

                        //Nom du stade
                        echo"<h4 class=h4>";
                        $s=$club->getElementsByTagName('picture')->item(0);
                        echo "<a href='stades.php?nom_club=".$nom."'> $s->nodeValue";
                        echo"</h4>";
                        echo"</td>";
                    }

                    echo"</div>";
                    echo"</tr>";
                    echo"</table><br /><br />";
                    ?>

                    <div>
                        <ul>
                            <li><span>Stats des joueurs</span></li>
                            <li><p>Ce contenu est en cours de dveloppement.</p></li>
                            <?php

                            ?>
                            <div class="cls"> </div>
                        </ul>
                    </div>
                </div>
                <div class="cls"> </div>
            </div>
        </div>
        <div class="cls"> </div>
    </div>
</div>
<?php
    echo('<script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false"></script>');
    echo('<script type="text/javascript" src="../js/localisation.js"></script>');
?>

