<div class="content">
    <div class="pnf">
        <div class="wrapper">
            <a href="#"><img src="images/404.jpg" title="404" /></a>
            <h1>Attention!!! Cette page n'existe pas.</h1>

            <?php

            $statistiques = new DomDocument;
            $statistiques->validateOnParse = TRUE;
            $statistiques->load("statistiques.xml");

            $nom_club =$_GET['nomClub'];
            echo $nom_club;
            $clubs = $statistiques->getElementsByTagName("nom_club");
            //$club = $statistiques->getElementById($idMovie);//one specific movie
            echo"<title>".$clubs->getElementsByTagName("nom_club")->item(0)->nodeValue."</title>";
            ?>

        </div>
    </div>
</div>


