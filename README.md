# watchqueue
WATCHQUEUE
WATCHQUEUE je veb sajt koji vam omogućava da pretražujete veliku TMDB bazu filmova i kreirate plejliste za gledanje filmova.
Kako radi
1.	Registracija
•	Da biste koristili WATCHQUEUE, morate se registrovati na sajtu. Možete kreirati svoj nalog unoseći svoje korisničko ime, e-poštu i lozinku.
2.	Pretraga filmova
•	Nakon što se prijavite, mozete istraziti neku od unapred kreiranih plejlisti na stranici DISCOVER.
•	WATCHQUEUE koristi TMDB API kako bi pružio bogat set podataka o filmovima. Omogucava dva nacina pretrage filmova – po kriterijumima I na osnovu unete reci
•	Na BROWSE stranici možete uneti naziv filma kako biste pronašli filmove koji vas zanimaju, na osnovu unete reci. Ukoliko je input prazan, stranica ce prikazati trenutno najpopularnije filmove. 
•	Rezultati pretrage prikazuju osnovne informacije o filmovima, kao što su naslov, poster i godina izdanja. Ispod slike svakog prikazanog rezultata su ponudjene mogucnost da se vidi vise detalja o filmu (zanr, kratak opis, glavni glumci, reziser, scenarista I datum premijere) kao I mogucnost da se film doda u omiljene filmove, koji se mogu pregledati na stranici FAVORITES, koja nudi mogucnost uklanjanja filmova iz omiljenih. 
•	Stranica SEARCH MOVIES omogucava detaljniju pretragu na osnovu kriterijuma. Najpre je potrebno uneti neke od kriterijuma (zanr, ocena, godina premijere I redosled kojim ce filmovi biti prikazani), nakon cega se prikazuju svi rezultati. Te rezultate je potom moguce pretraziti na osnovu unete reci. 

3.	Kreiranje plejlista
•	WATCHQUEUE vam omogućava da kreirate plejliste kako biste organizovali filmove koje želite gledati, na stranici CREATE PLAYLIST, klikom na dugme +CREATE PLAYLIST.
•	Novi plejlistu kreirate tako sto unesete naziv i opis plejlsite, a zatim dodajete neke od unapred odabranih omiljenih filmova u tu plejlistu.
•	Kreirane plejliste mozete pregledati na stranici MY PLAYLISTS. Stranica MY PLAYLISTS nudi mogucnost dodavanja I brisanja filmova iz plejliste, kao I brisanje samih plejlisti
Tehnologije
WATCHQUEUE je izgrađen korišćenjem sledećih tehnologija:
•	Frontend: HTML, CSS, JavaScript
•	Backend: Node.js
•	Baza podataka: MongoDB
•	TMDB API: Koristi se za preuzimanje podataka o filmovima

