<div class="content">
    <div class="apropos">
        <div class="wrapper">
            <div class="a-left">
                <div class="apropos-histore">
                    <h3>Palmares</h3>
                    <div class="historey-lines">
                        <ul>
                            <li><span>Palmares des clubs</span></li>
                            <?php
                            $xml = new DomDocument;
                            $xml->load("datas/statistiques.xml");
                            $liste_clubs = $xml->getElementsByTagName("stats-club");
                            foreach($liste_clubs as $club) {
                                $c = $club->getAttribute("nom_club");
                                $m = $club->getElementsByTagName('type-match')->item(0);
                                echo $c;
                            }
                            ?>
                        </ul>
                    </div>
                    <div class="historey-lines">
                        <ul>
                            <li><span>Palmares des joueurs</span></li>
                            <li><p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Praesent vestibulum molestie lacus. Aeonummy hendrerit mauris. Phasellus porta. Fusce suscipit varius mi.</p></li>
                            <div class="cls"> </div>
                        </ul>
                    </div>
                    <div class="historey-lines">
                        <ul>
                            <li><span>Palmares des entraineurs</span></li>
                            <li><p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Praesent vestibulum molestie lacus. Aeonummy hendrerit mauris. Phasellus porta. Fusce suscipit varius mi.</p></li>
                            <div class="cls"> </div>
                        </ul>
                    </div>
                    </div>
                    <div class="cls"> </div>
                </div>
            </div>
            <div class="apropos-right">
                <div class="apropos-sidebar">
                    <h3>Derniers twits...</h3>
                    <ul>
                        <li><a href="#"></a></li>
                    </ul>
                </div>
            </div>
            <div class="cls"> </div>
        </div>
    </div>
</div>

