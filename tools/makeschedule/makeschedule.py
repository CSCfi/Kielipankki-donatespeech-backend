import sys
import uuid
import json
import csv
import logging

# Read CSV, output JSON schedule file

yle_cdn_url = 'https://images.cdn.yle.fi/image/upload/w_1198,h_674,f_auto,fl_lossy,q_auto:eco/'

environment_name = 'dev'

NATIVE_LANGUAGE_QUERY_ITEM_ID = 'fa3ecb10-1128-4c8c-a838-600a0faadc2e'

metadata_queries = {
    NATIVE_LANGUAGE_QUERY_ITEM_ID: {
        'options': [
            { "fi": "suomi" },
            { "fi": "ruotsi" },
            { "fi": "venäjä" },
            { "fi": "viro (eesti)" },
            { "fi": "arabia" },
            { "fi": "somali" },
            { "fi": "englanti" },
            { "fi": "kurdi" },
            { "fi": "persia (farsi)" },
            { "fi": "muu kieli" }
        ]
    },

    'e3264046-a642-46de-a9e7-c55933ee3739': {
        "options": [ 
            { "fi": "1-10 vuotta" },
            { "fi": "11-20 vuotta" },
            { "fi": "21-30 vuotta" },
            { "fi": "31-40 vuotta" },
            { "fi": "41-50 vuotta" },
            { "fi": "51-60 vuotta" },
            { "fi": "61-70 vuotta" },
            { "fi": "71-80 vuotta" },
            { "fi": "81-90 vuotta" },
            { "fi": "91-100 vuotta" },
            { "fi": "101+ vuotta" }
        ]
    },

    "8bbb8e5d-56a2-4082-9429-233ff2a5e53f": {
        "options": [
            { "fi": "Nainen" }, 
            { "fi": "Mies" }, 
            { "fi": "Muu" }, 
            { "fi": "En halua kertoa" }
        ]
    },

    "6ef34957-41e7-487e-aa0c-a40c93ed9251": {
        "options": [
            { "fi": "Uusimaa" },
            { "fi": "Varsinais-Suomi" },
            { "fi": "Satakunta" },
            { "fi": "Häme" },
            { "fi": "Pirkanmaa" },
            { "fi": "Päijät-Häme" },
            { "fi": "Kymenlaakso" },
            { "fi": "Etelä-Karjala" },
            { "fi": "Etelä-Savo" },
            { "fi": "Pohjois-Savo" },
            { "fi": "Pohjois-Karjala" },
            { "fi": "Keski-Suomi" },
            { "fi": "Etelä-Pohjanmaa" },
            { "fi": "Pohjanmaa" },
            { "fi": "Keski-Pohjanmaa" },
            { "fi": "Pohjois-Pohjanmaa" },
            { "fi": "Kainuu" },
            { "fi": "Lappi" },
            { "fi": "Ahvenanmaa" },
            { "fi": "Muu kuin Suomi" }
        ]
    },

    "626d3fb5-6b82-4d5d-bdde-1637e571ca28": {  # asuinpaikka
        "options": [
            { "fi": "Akaa" },
            { "fi": "Alajärvi" },
            { "fi": "Alavieska" },
            { "fi": "Alavus" },
            { "fi": "Asikkala" },
            { "fi": "Askola" },
            { "fi": "Aura" },
            { "fi": "Brändö" },
            { "fi": "Eckerö" },
            { "fi": "Enonkoski" },
            { "fi": "Enontekiö" },
            { "fi": "Espoo" },
            { "fi": "Eura" },
            { "fi": "Eurajoki" },
            { "fi": "Evijärvi" },
            { "fi": "Finström" },
            { "fi": "Forssa" },
            { "fi": "Föglö" },
            { "fi": "Geta" },
            { "fi": "Haapajärvi" },
            { "fi": "Haapavesi" },
            { "fi": "Hailuoto" },
            { "fi": "Halsua" },
            { "fi": "Hamina" },
            { "fi": "Hammarland" },
            { "fi": "Hankasalmi" },
            { "fi": "Hanko" },
            { "fi": "Harjavalta" },
            { "fi": "Hartola" },
            { "fi": "Hattula" },
            { "fi": "Hausjärvi" },
            { "fi": "Heinola" },
            { "fi": "Heinävesi" },
            { "fi": "Helsinki" },
            { "fi": "Hirvensalmi" },
            { "fi": "Hollola" },
            { "fi": "Honkajoki" },
            { "fi": "Huittinen" },
            { "fi": "Humppila" },
            { "fi": "Hyrynsalmi" },
            { "fi": "Hyvinkää" },
            { "fi": "Hämeenkoski" },
            { "fi": "Hämeenkyrö" },
            { "fi": "Hämeenlinna" },
            { "fi": "Ii" },
            { "fi": "Iisalmi" },
            { "fi": "Iitti" },
            { "fi": "Ikaalinen" },
            { "fi": "Ilmajoki" },
            { "fi": "Ilomantsi" },
            { "fi": "Imatra" },
            { "fi": "Inari" },
            { "fi": "Inkoo" },
            { "fi": "Isojoki" },
            { "fi": "Isokyrö" },
            { "fi": "Jalasjärvi" },
            { "fi": "Janakkala" },
            { "fi": "Joensuu" },
            { "fi": "Jokioinen" },
            { "fi": "Jomala" },
            { "fi": "Joroinen" },
            { "fi": "Joutsa" },
            { "fi": "Juankoski" },
            { "fi": "Juuka" },
            { "fi": "Juupajoki" },
            { "fi": "Juva" },
            { "fi": "Jyväskylä" },
            { "fi": "Jämijärvi" },
            { "fi": "Jämsä" },
            { "fi": "Järvenpää" },
            { "fi": "Kaarina" },
            { "fi": "Kaavi" },
            { "fi": "Kajaani" },
            { "fi": "Kalajoki" },
            { "fi": "Kangasala" },
            { "fi": "Kangasniemi" },
            { "fi": "Kankaanpää" },
            { "fi": "Kannonkoski" },
            { "fi": "Kannus" },
            { "fi": "Karijoki" },
            { "fi": "Karkkila" },
            { "fi": "Karstula" },
            { "fi": "Karvia" },
            { "fi": "Kaskinen" },
            { "fi": "Kauhajoki" },
            { "fi": "Kauhava" },
            { "fi": "Kauniainen" },
            { "fi": "Kaustinen" },
            { "fi": "Keitele" },
            { "fi": "Kemi" },
            { "fi": "Kemijärvi" },
            { "fi": "Keminmaa" },
            { "fi": "Kemiönsaari" },
            { "fi": "Kempele" },
            { "fi": "Kerava" },
            { "fi": "Keuruu" },
            { "fi": "Kihniö" },
            { "fi": "Kinnula" },
            { "fi": "Kirkkonummi" },
            { "fi": "Kitee" },
            { "fi": "Kittilä" },
            { "fi": "Kiuruvesi" },
            { "fi": "Kivijärvi" },
            { "fi": "Kokemäki" },
            { "fi": "Kokkola" },
            { "fi": "Kolari" },
            { "fi": "Konnevesi" },
            { "fi": "Kontiolahti" },
            { "fi": "Korsnäs" },
            { "fi": "Koski Tl" },
            { "fi": "Kotka" },
            { "fi": "Kouvola" },
            { "fi": "Kristiinankaupunki" },
            { "fi": "Kruunupyy" },
            { "fi": "Kuhmo" },
            { "fi": "Kuhmoinen" },
            { "fi": "Kumlinge" },
            { "fi": "Kuopio" },
            { "fi": "Kuortane" },
            { "fi": "Kurikka" },
            { "fi": "Kustavi" },
            { "fi": "Kuusamo" },
            { "fi": "Kyyjärvi" },
            { "fi": "Kärkölä" },
            { "fi": "Kärsämäki" },
            { "fi": "Kökar" },
            { "fi": "Köyliö" },
            { "fi": "Lahti" },
            { "fi": "Laihia" },
            { "fi": "Laitila" },
            { "fi": "Lapinjärvi" },
            { "fi": "Lapinlahti" },
            { "fi": "Lappajärvi" },
            { "fi": "Lappeenranta" },
            { "fi": "Lapua" },
            { "fi": "Laukaa" },
            { "fi": "Lavia" },
            { "fi": "Lemi" },
            { "fi": "Lemland" },
            { "fi": "Lempäälä" },
            { "fi": "Leppävirta" },
            { "fi": "Lestijärvi" },
            { "fi": "Lieksa" },
            { "fi": "Lieto" },
            { "fi": "Liminka" },
            { "fi": "Liperi" },
            { "fi": "Lohja" },
            { "fi": "Loimaa" },
            { "fi": "Loppi" },
            { "fi": "Loviisa" },
            { "fi": "Luhanka" },
            { "fi": "Lumijoki" },
            { "fi": "Lumparland" },
            { "fi": "Luoto" },
            { "fi": "Luumäki" },
            { "fi": "Luvia" },
            { "fi": "Maalahti" },
            { "fi": "Maaninka" },
            { "fi": "Maarianhamina" },
            { "fi": "Marttila" },
            { "fi": "Masku" },
            { "fi": "Merijärvi" },
            { "fi": "Merikarvia" },
            { "fi": "Miehikkälä" },
            { "fi": "Mikkeli" },
            { "fi": "Muhos" },
            { "fi": "Multia" },
            { "fi": "Muonio" },
            { "fi": "Mustasaari" },
            { "fi": "Muurame" },
            { "fi": "Mynämäki" },
            { "fi": "Myrskylä" },
            { "fi": "Mäntsälä" },
            { "fi": "Mänttä-Vilppula" },
            { "fi": "Mäntyharju" },
            { "fi": "Naantali" },
            { "fi": "Nakkila" },
            { "fi": "Nastola" },
            { "fi": "Nivala" },
            { "fi": "Nokia" },
            { "fi": "Nousiainen" },
            { "fi": "Nurmes" },
            { "fi": "Nurmijärvi" },
            { "fi": "Närpiö" },
            { "fi": "Orimattila" },
            { "fi": "Oripää" },
            { "fi": "Orivesi" },
            { "fi": "Oulainen" },
            { "fi": "Oulu" },
            { "fi": "Outokumpu" },
            { "fi": "Padasjoki" },
            { "fi": "Paimio" },
            { "fi": "Paltamo" },
            { "fi": "Parainen" },
            { "fi": "Parikkala" },
            { "fi": "Parkano" },
            { "fi": "Pedersören kunta" },
            { "fi": "Pelkosenniemi" },
            { "fi": "Pello" },
            { "fi": "Perho" },
            { "fi": "Pertunmaa" },
            { "fi": "Petäjävesi" },
            { "fi": "Pieksämäki" },
            { "fi": "Pielavesi" },
            { "fi": "Pietarsaari" },
            { "fi": "Pihtipudas" },
            { "fi": "Pirkkala" },
            { "fi": "Polvijärvi" },
            { "fi": "Pomarkku" },
            { "fi": "Pori" },
            { "fi": "Pornainen" },
            { "fi": "Porvoo" },
            { "fi": "Posio" },
            { "fi": "Pudasjärvi" },
            { "fi": "Pukkila" },
            { "fi": "Punkalaidun" },
            { "fi": "Puolanka" },
            { "fi": "Puumala" },
            { "fi": "Pyhtää" },
            { "fi": "Pyhäjoki" },
            { "fi": "Pyhäjärvi" },
            { "fi": "Pyhäntä" },
            { "fi": "Pyhäranta" },
            { "fi": "Pälkäne" },
            { "fi": "Pöytyä" },
            { "fi": "Raahe" },
            { "fi": "Raasepori" },
            { "fi": "Raisio" },
            { "fi": "Rantasalmi" },
            { "fi": "Ranua" },
            { "fi": "Rauma" },
            { "fi": "Rautalampi" },
            { "fi": "Rautavaara" },
            { "fi": "Rautjärvi" },
            { "fi": "Reisjärvi" },
            { "fi": "Riihimäki" },
            { "fi": "Ristijärvi" },
            { "fi": "Rovaniemi" },
            { "fi": "Ruokolahti" },
            { "fi": "Ruovesi" },
            { "fi": "Rusko" },
            { "fi": "Rääkkylä" },
            { "fi": "Saarijärvi" },
            { "fi": "Salla" },
            { "fi": "Salo" },
            { "fi": "Saltvik" },
            { "fi": "Sastamala" },
            { "fi": "Sauvo" },
            { "fi": "Savitaipale" },
            { "fi": "Savonlinna" },
            { "fi": "Savukoski" },
            { "fi": "Seinäjoki" },
            { "fi": "Sievi" },
            { "fi": "Siikainen" },
            { "fi": "Siikajoki" },
            { "fi": "Siikalatva" },
            { "fi": "Siilinjärvi" },
            { "fi": "Simo" },
            { "fi": "Sipoo" },
            { "fi": "Siuntio" },
            { "fi": "Sodankylä" },
            { "fi": "Soini" },
            { "fi": "Somero" },
            { "fi": "Sonkajärvi" },
            { "fi": "Sotkamo" },
            { "fi": "Sottunga" },
            { "fi": "Sulkava" },
            { "fi": "Sund" },
            { "fi": "Suomussalmi" },
            { "fi": "Suonenjoki" },
            { "fi": "Sysmä" },
            { "fi": "Säkylä" },
            { "fi": "Taipalsaari" },
            { "fi": "Taivalkoski" },
            { "fi": "Taivassalo" },
            { "fi": "Tammela" },
            { "fi": "Tampere" },
            { "fi": "Tarvasjoki" },
            { "fi": "Tervo" },
            { "fi": "Tervola" },
            { "fi": "Teuva" },
            { "fi": "Tohmajärvi" },
            { "fi": "Toholampi" },
            { "fi": "Toivakka" },
            { "fi": "Tornio" },
            { "fi": "Turku" },
            { "fi": "Tuusniemi" },
            { "fi": "Tuusula" },
            { "fi": "Tyrnävä" },
            { "fi": "Ulvila" },
            { "fi": "Urjala" },
            { "fi": "Utajärvi" },
            { "fi": "Utsjoki" },
            { "fi": "Uurainen" },
            { "fi": "Uusikaarlepyy" },
            { "fi": "Uusikaupunki" },
            { "fi": "Vaala" },
            { "fi": "Vaasa" },
            { "fi": "Valkeakoski" },
            { "fi": "Valtimo" },
            { "fi": "Vantaa" },
            { "fi": "Varkaus" },
            { "fi": "Vehmaa" },
            { "fi": "Vesanto" },
            { "fi": "Vesilahti" },
            { "fi": "Veteli" },
            { "fi": "Vieremä" },
            { "fi": "Vihti" },
            { "fi": "Viitasaari" },
            { "fi": "Vimpeli" },
            { "fi": "Virolahti" },
            { "fi": "Virrat" },
            { "fi": "Vårdö" },
            { "fi": "Vöyri" },
            { "fi": "Ylitornio" },
            { "fi": "Ylivieska" },
            { "fi": "Ylöjärvi" },
            { "fi": "Ypäjä" },
            { "fi": "Ähtäri" },
            { "fi": "Äänekoski" }               
        ]
    },

    "dad311ea-3e7f-4d16-b76b-0c94aaf9fc73": { # birthplace
        "options": [
            { "fi": "Ahlainen" },
            { "fi": "Aitolahti" },
            { "fi": "Akaa" },
            { "fi": "Alahärmä" },
            { "fi": "Alajärvi" },
            { "fi": "Alastaro" },
            { "fi": "Alatornio" },
            { "fi": "Alaveteli" },
            { "fi": "Alavieska" },
            { "fi": "Alavus" },
            { "fi": "Angelniemi" },
            { "fi": "Anjala" },
            { "fi": "Anjalankoski" },
            { "fi": "Antrea" },
            { "fi": "Anttola" },
            { "fi": "Artjärvi" },
            { "fi": "Asikkala" },
            { "fi": "Askainen" },
            { "fi": "Askola" },
            { "fi": "Aura" },
            { "fi": "Bergö" },
            { "fi": "Björkoby" },
            { "fi": "Bromarv" },
            { "fi": "Brändö" },
            { "fi": "Degerby" },
            { "fi": "Dragsfjärd" },
            { "fi": "Eckerö" },
            { "fi": "Elimäki" },
            { "fi": "Eno" },
            { "fi": "Enonkoski" },
            { "fi": "Enontekiö" },
            { "fi": "Eräjärvi" },
            { "fi": "Espoo" },
            { "fi": "Eura" },
            { "fi": "Eurajoki" },
            { "fi": "Evijärvi" },
            { "fi": "Finström" },
            { "fi": "Forssa" },
            { "fi": "Föglö" },
            { "fi": "Geta" },
            { "fi": "Haaga" },
            { "fi": "Haapajärvi" },
            { "fi": "Haapasaari" },
            { "fi": "Haapavesi" },
            { "fi": "Hailuoto" },
            { "fi": "Halikko" },
            { "fi": "Halsua" },
            { "fi": "Hamina" },
            { "fi": "Hammarland" },
            { "fi": "Hankasalmi" },
            { "fi": "Hanko" },
            { "fi": "Harjavalta" },
            { "fi": "Harlu" },
            { "fi": "Hartola" },
            { "fi": "Hattula" },
            { "fi": "Hauho" },
            { "fi": "Haukipudas" },
            { "fi": "Haukivuori" },
            { "fi": "Hausjärvi" },
            { "fi": "Heinjoki" },
            { "fi": "Heinola" },
            { "fi": "Heinolan mlk" },
            { "fi": "Heinävesi" },
            { "fi": "Helsinki" },
            { "fi": "Hiitola" },
            { "fi": "Hiittinen" },
            { "fi": "Himanka" },
            { "fi": "Hinnerjoki" },
            { "fi": "Hirvensalmi" },
            { "fi": "Hollola" },
            { "fi": "Honkajoki" },
            { "fi": "Honkilahti" },
            { "fi": "Houtskari" },
            { "fi": "Huittinen" },
            { "fi": "Humppila" },
            { "fi": "Huopalahti" },
            { "fi": "Hyrynsalmi" },
            { "fi": "Hyvinkää" },
            { "fi": "Hyvinkään mlk" },
            { "fi": "Hämeenkoski" },
            { "fi": "Hämeenkyrö" },
            { "fi": "Hämeenlinna" },
            { "fi": "Hämeenlinnan mlk" },
            { "fi": "Ii" },
            { "fi": "Iisalmen mlk" },
            { "fi": "Iisalmi" },
            { "fi": "Iitti" },
            { "fi": "Ikaalinen" },
            { "fi": "Ikaalisten mlk" },
            { "fi": "Ilmajoki" },
            { "fi": "Ilomantsi" },
            { "fi": "Imatra" },
            { "fi": "Impilahti" },
            { "fi": "Inari" },
            { "fi": "Iniö" },
            { "fi": "Inkoo" },
            { "fi": "Isojoki" },
            { "fi": "Isokyrö" },
            { "fi": "Jaakkima" },
            { "fi": "Jaala" },
            { "fi": "Jalasjärvi" },
            { "fi": "Janakkala" },
            { "fi": "Jepua" },
            { "fi": "Joensuu" },
            { "fi": "Johannes" },
            { "fi": "Jokioinen" },
            { "fi": "Jomala" },
            { "fi": "Joroinen" },
            { "fi": "Joutsa" },
            { "fi": "Joutseno" },
            { "fi": "Juankoski" },
            { "fi": "Jurva" },
            { "fi": "Juuka" },
            { "fi": "Juupajoki" },
            { "fi": "Juva" },
            { "fi": "Jyväskylä" },
            { "fi": "Jyväskylän mlk" },
            { "fi": "Jämijärvi" },
            { "fi": "Jämsä" },
            { "fi": "Jämsänkoski" },
            { "fi": "Jäppilä" },
            { "fi": "Järvenpää" },
            { "fi": "Jääski" },
            { "fi": "Kaarina" },
            { "fi": "Kaarlela" },
            { "fi": "Kaavi" },
            { "fi": "Kajaani" },
            { "fi": "Kajaanin mlk" },
            { "fi": "Kakskerta" },
            { "fi": "Kalajoki" },
            { "fi": "Kalanti" },
            { "fi": "Kalvola" },
            { "fi": "Kangasala" },
            { "fi": "Kangaslampi" },
            { "fi": "Kangasniemi" },
            { "fi": "Kankaanpää" },
            { "fi": "Kanneljärvi" },
            { "fi": "Kannonkoski" },
            { "fi": "Kannus" },
            { "fi": "Karhula" },
            { "fi": "Karijoki" },
            { "fi": "Karinainen" },
            { "fi": "Karjaan mlk" },
            { "fi": "Karjala" },
            { "fi": "Karjalohja" },
            { "fi": "Karkkila" },
            { "fi": "Karkku" },
            { "fi": "Karstula" },
            { "fi": "Karttula" },
            { "fi": "Karuna" },
            { "fi": "Karunki" },
            { "fi": "Karvia" },
            { "fi": "Kaskinen" },
            { "fi": "Kauhajoki" },
            { "fi": "Kauhava" },
            { "fi": "Kaukola" },
            { "fi": "Kauniainen" },
            { "fi": "Kaustinen" },
            { "fi": "Kauvatsa" },
            { "fi": "Keikyä" },
            { "fi": "Keitele" },
            { "fi": "Kemi" },
            { "fi": "Kemijärven mlk" },
            { "fi": "Kemijärvi" },
            { "fi": "Keminmaa" },
            { "fi": "Kemiö" },
            { "fi": "Kemiönsaari" },
            { "fi": "Kempele" },
            { "fi": "Kerava" },
            { "fi": "Kerimäki" },
            { "fi": "Kestilä" },
            { "fi": "Kesälahti" },
            { "fi": "Keuruu" },
            { "fi": "Kihniö" },
            { "fi": "Kiihtelysvaara" },
            { "fi": "Kiikala" },
            { "fi": "Kiikka" },
            { "fi": "Kiikoinen" },
            { "fi": "Kiiminki" },
            { "fi": "Kinnula" },
            { "fi": "Kirkkonummi" },
            { "fi": "Kirvu" },
            { "fi": "Kisko" },
            { "fi": "Kitee" },
            { "fi": "Kittilä" },
            { "fi": "Kiukainen" },
            { "fi": "Kiuruvesi" },
            { "fi": "Kivennapa" },
            { "fi": "Kivijärvi" },
            { "fi": "Kodisjoki" },
            { "fi": "Koijärvi" },
            { "fi": "Koivisto" },
            { "fi": "Koiviston mlk" },
            { "fi": "Koivulahti" },
            { "fi": "Kokemäki" },
            { "fi": "Kokkola" },
            { "fi": "Kolari" },
            { "fi": "Konginkangas" },
            { "fi": "Konnevesi" },
            { "fi": "Kontiolahti" },
            { "fi": "Korpilahti" },
            { "fi": "Korpiselkä" },
            { "fi": "Korppoo" },
            { "fi": "Korsnäs" },
            { "fi": "Kortesjärvi" },
            { "fi": "Koskenpää" },
            { "fi": "Koski Tl" },
            { "fi": "Kotka" },
            { "fi": "Kouvola" },
            { "fi": "Kristiinankaupunki" },
            { "fi": "Kruunupyy" },
            { "fi": "Kuhmalahti" },
            { "fi": "Kuhmo" },
            { "fi": "Kuhmoinen" },
            { "fi": "Kuivaniemi" },
            { "fi": "Kullaa" },
            { "fi": "Kulosaari" },
            { "fi": "Kumlinge" },
            { "fi": "Kuolemajärvi" },
            { "fi": "Kuopio" },
            { "fi": "Kuopion mlk" },
            { "fi": "Kuorevesi" },
            { "fi": "Kuortane" },
            { "fi": "Kurikka" },
            { "fi": "Kurkijoki" },
            { "fi": "Kuru" },
            { "fi": "Kustavi" },
            { "fi": "Kuusamo" },
            { "fi": "Kuusankoski" },
            { "fi": "Kuusisto" },
            { "fi": "Kuusjoki" },
            { "fi": "Kylmäkoski" },
            { "fi": "Kymi" },
            { "fi": "Kyyjärvi" },
            { "fi": "Kyyrölä" },
            { "fi": "Käkisalmen mlk" },
            { "fi": "Käkisalmi" },
            { "fi": "Kälviä" },
            { "fi": "Kärkölä" },
            { "fi": "Kärsämäki" },
            { "fi": "Kökar" },
            { "fi": "Köyliö" },
            { "fi": "Lahdenpohja" },
            { "fi": "Lahti" },
            { "fi": "Laihia" },
            { "fi": "Laitila" },
            { "fi": "Lammi" },
            { "fi": "Lapinjärvi" },
            { "fi": "Lapinlahti" },
            { "fi": "Lappajärvi" },
            { "fi": "Lappee" },
            { "fi": "Lappeenranta" },
            { "fi": "Lappi" },
            { "fi": "Lapua" },
            { "fi": "Lapväärtti" },
            { "fi": "Laukaa" },
            { "fi": "Lauritsala" },
            { "fi": "Lavansaari" },
            { "fi": "Lavia" },
            { "fi": "Lehtimäki" },
            { "fi": "Leivonmäki" },
            { "fi": "Lemi" },
            { "fi": "Lemland" },
            { "fi": "Lempäälä" },
            { "fi": "Lemu" },
            { "fi": "Leppävirta" },
            { "fi": "Lestijärvi" },
            { "fi": "Lieksa" },
            { "fi": "Lieto" },
            { "fi": "Liljendal" },
            { "fi": "Liminka" },
            { "fi": "Liperi" },
            { "fi": "Lohja" },
            { "fi": "Lohjan kunta" },
            { "fi": "Lohtaja" },
            { "fi": "Loimaa" },
            { "fi": "Loimaan kunta" },
            { "fi": "Lokalahti" },
            { "fi": "Loppi" },
            { "fi": "Loviisa" },
            { "fi": "Luhanka" },
            { "fi": "Lumijoki" },
            { "fi": "Lumivaara" },
            { "fi": "Lumparland" },
            { "fi": "Luopioinen" },
            { "fi": "Luoto" },
            { "fi": "Luumäki" },
            { "fi": "Luvia" },
            { "fi": "Längelmäki" },
            { "fi": "Maalahti" },
            { "fi": "Maaninka" },
            { "fi": "Maaria" },
            { "fi": "Maarianhamina" },
            { "fi": "Maksamaa" },
            { "fi": "Marttila" },
            { "fi": "Masku" },
            { "fi": "Mellilä" },
            { "fi": "Merijärvi" },
            { "fi": "Merikarvia" },
            { "fi": "Merimasku" },
            { "fi": "Messukylä" },
            { "fi": "Metsämaa" },
            { "fi": "Metsäpirtti" },
            { "fi": "Miehikkälä" },
            { "fi": "Mietoinen" },
            { "fi": "Mikkeli" },
            { "fi": "Mikkelin mlk" },
            { "fi": "Mouhijärvi" },
            { "fi": "Muhos" },
            { "fi": "Multia" },
            { "fi": "Munsala" },
            { "fi": "Muolaa" },
            { "fi": "Muonio" },
            { "fi": "Mustasaari" },
            { "fi": "Muurame" },
            { "fi": "Muurla" },
            { "fi": "Muuruvesi" },
            { "fi": "Mynämäki" },
            { "fi": "Myrskylä" },
            { "fi": "Mäntsälä" },
            { "fi": "Mänttä" },
            { "fi": "Mänttä-Vilppula" },
            { "fi": "Mäntyharju" },
            { "fi": "Naantali" },
            { "fi": "Naantalin mlk" },
            { "fi": "Nakkila" },
            { "fi": "Nastola" },
            { "fi": "Nauvo" },
            { "fi": "Nilsiä" },
            { "fi": "Nivala" },
            { "fi": "Nokia" },
            { "fi": "Noormarkku" },
            { "fi": "Nousiainen" },
            { "fi": "Nuijamaa" },
            { "fi": "Nummi" },
            { "fi": "Nummi-Pusula" },
            { "fi": "Nurmeksen mlk" },
            { "fi": "Nurmes" },
            { "fi": "Nurmijärvi" },
            { "fi": "Nurmo" },
            { "fi": "Närpiö" },
            { "fi": "Oravainen" },
            { "fi": "Orimattila" },
            { "fi": "Oripää" },
            { "fi": "Orivesi" },
            { "fi": "Oulainen" },
            { "fi": "Oulu" },
            { "fi": "Oulujoki" },
            { "fi": "Oulunkylä" },
            { "fi": "Oulunsalo" },
            { "fi": "Outokumpu" },
            { "fi": "Paattinen" },
            { "fi": "Paavola" },
            { "fi": "Padasjoki" },
            { "fi": "Paimio" },
            { "fi": "Paltamo" },
            { "fi": "Parainen" },
            { "fi": "Paraisten mlk" },
            { "fi": "Parikkala" },
            { "fi": "Parkano" },
            { "fi": "Pattijoki" },
            { "fi": "Pedersören kunta" },
            { "fi": "Pelkosenniemi" },
            { "fi": "Pello" },
            { "fi": "Perho" },
            { "fi": "Pernaja" },
            { "fi": "Perniö" },
            { "fi": "Pertteli" },
            { "fi": "Pertunmaa" },
            { "fi": "Peräseinäjoki" },
            { "fi": "Petolahti" },
            { "fi": "Petsamo" },
            { "fi": "Petäjävesi" },
            { "fi": "Pieksämäen mlk" },
            { "fi": "Pieksämäki" },
            { "fi": "Pieksänmaa" },
            { "fi": "Pielavesi" },
            { "fi": "Pielisensuu" },
            { "fi": "Pielisjärvi" },
            { "fi": "Pietarsaari" },
            { "fi": "Pihlajavesi" },
            { "fi": "Pihtipudas" },
            { "fi": "Piikkiö" },
            { "fi": "Piippola" },
            { "fi": "Pirkkala" },
            { "fi": "Pirttikylä" },
            { "fi": "Pohja" },
            { "fi": "Pohjaslahti" },
            { "fi": "Polvijärvi" },
            { "fi": "Pomarkku" },
            { "fi": "Pori" },
            { "fi": "Porin mlk" },
            { "fi": "Pornainen" },
            { "fi": "Porvoo" },
            { "fi": "Porvoon mlk" },
            { "fi": "Posio" },
            { "fi": "Pudasjärvi" },
            { "fi": "Pukkila" },
            { "fi": "Pulkkila" },
            { "fi": "Punkaharju" },
            { "fi": "Punkalaidun" },
            { "fi": "Puolanka" },
            { "fi": "Purmo" },
            { "fi": "Pusula" },
            { "fi": "Puumala" },
            { "fi": "Pyhtää" },
            { "fi": "Pyhäjoki" },
            { "fi": "Pyhäjärvi" },
            { "fi": "Pyhäjärvi Ul" },
            { "fi": "Pyhäjärvi Vl" },
            { "fi": "Pyhämaa" },
            { "fi": "Pyhäntä" },
            { "fi": "Pyhäranta" },
            { "fi": "Pyhäselkä" },
            { "fi": "Pylkönmäki" },
            { "fi": "Pälkjärvi" },
            { "fi": "Pälkäne" },
            { "fi": "Pöytyä" },
            { "fi": "Raahe" },
            { "fi": "Raasepori" },
            { "fi": "Raippaluoto" },
            { "fi": "Raisio" },
            { "fi": "Rantasalmi" },
            { "fi": "Rantsila" },
            { "fi": "Ranua" },
            { "fi": "Rauma" },
            { "fi": "Rauman mlk" },
            { "fi": "Rautalampi" },
            { "fi": "Rautavaara" },
            { "fi": "Rautio" },
            { "fi": "Rautjärvi" },
            { "fi": "Rautu" },
            { "fi": "Reisjärvi" },
            { "fi": "Renko" },
            { "fi": "Revonlahti" },
            { "fi": "Riihimäki" },
            { "fi": "Riistavesi" },
            { "fi": "Ristiina" },
            { "fi": "Ristijärvi" },
            { "fi": "Rovaniemen maalaiskunta" },
            { "fi": "Rovaniemi" },
            { "fi": "Ruokolahti" },
            { "fi": "Ruotsinpyhtää" },
            { "fi": "Ruovesi" },
            { "fi": "Ruskeala" },
            { "fi": "Rusko" },
            { "fi": "Ruukki" },
            { "fi": "Rymättylä" },
            { "fi": "Räisälä" },
            { "fi": "Rääkkylä" },
            { "fi": "Saari" },
            { "fi": "Saarijärvi" },
            { "fi": "Sahalahti" },
            { "fi": "Sakkola" },
            { "fi": "Salla" },
            { "fi": "Salmi" },
            { "fi": "Salo" },
            { "fi": "Saloinen" },
            { "fi": "Saltvik" },
            { "fi": "Sammatti" },
            { "fi": "Sastamala" },
            { "fi": "Sauvo" },
            { "fi": "Savitaipale" },
            { "fi": "Savonlinna" },
            { "fi": "Savonranta" },
            { "fi": "Savukoski" },
            { "fi": "Seinäjoen mlk" },
            { "fi": "Seinäjoki" },
            { "fi": "Seiskari" },
            { "fi": "Sievi" },
            { "fi": "Siikainen" },
            { "fi": "Siikajoki" },
            { "fi": "Siikalatva" },
            { "fi": "Siilinjärvi" },
            { "fi": "Siipyy" },
            { "fi": "Simo" },
            { "fi": "Simpele" },
            { "fi": "Sipoo" },
            { "fi": "Sippola" },
            { "fi": "Siuntio" },
            { "fi": "Snappertuna" },
            { "fi": "Soanlahti" },
            { "fi": "Sodankylä" },
            { "fi": "Soini" },
            { "fi": "Somerniemi" },
            { "fi": "Somero" },
            { "fi": "Sonkajärvi" },
            { "fi": "Sortavala" },
            { "fi": "Sortavalan mlk" },
            { "fi": "Sotkamo" },
            { "fi": "Sottunga" },
            { "fi": "Suistamo" },
            { "fi": "Sulkava" },
            { "fi": "Sulva" },
            { "fi": "Sumiainen" },
            { "fi": "Sund" },
            { "fi": "Suodenniemi" },
            { "fi": "Suojärvi" },
            { "fi": "Suolahti" },
            { "fi": "Suomenniemi" },
            { "fi": "Suomusjärvi" },
            { "fi": "Suomussalmi" },
            { "fi": "Suonenjoki" },
            { "fi": "Suoniemi" },
            { "fi": "Suursaari" },
            { "fi": "Sysmä" },
            { "fi": "Säkkijärvi" },
            { "fi": "Säkylä" },
            { "fi": "Särkisalo" },
            { "fi": "Säyneinen" },
            { "fi": "Säynätsalo" },
            { "fi": "Sääksmäki" },
            { "fi": "Sääminki" },
            { "fi": "Taipalsaari" },
            { "fi": "Taivalkoski" },
            { "fi": "Taivassalo" },
            { "fi": "Tammela" },
            { "fi": "Tammisaaren mlk" },
            { "fi": "Tammisaari" },
            { "fi": "Tampere" },
            { "fi": "Tarvasjoki" },
            { "fi": "Teerijärvi" },
            { "fi": "Teisko" },
            { "fi": "Temmes" },
            { "fi": "Tenhola" },
            { "fi": "Terijoki" },
            { "fi": "Tervo" },
            { "fi": "Tervola" },
            { "fi": "Teuva" },
            { "fi": "Tiukka" },
            { "fi": "Tohmajärvi" },
            { "fi": "Toholampi" },
            { "fi": "Toijala" },
            { "fi": "Toivakka" },
            { "fi": "Tornio" },
            { "fi": "Tottijärvi" },
            { "fi": "Turku" },
            { "fi": "Tuulos" },
            { "fi": "Tuupovaara" },
            { "fi": "Tuusniemi" },
            { "fi": "Tuusula" },
            { "fi": "Tyrnävä" },
            { "fi": "Tyrväntö" },
            { "fi": "Tyrvää" },
            { "fi": "Tytärsaari" },
            { "fi": "Töysä" },
            { "fi": "Ullava" },
            { "fi": "Ulvila" },
            { "fi": "Urjala" },
            { "fi": "Uskela" },
            { "fi": "Utajärvi" },
            { "fi": "Utsjoki" },
            { "fi": "Uudenkaarlepyyn mlk" },
            { "fi": "Uudenkaupungin mlk" },
            { "fi": "Uukuniemi" },
            { "fi": "Uurainen" },
            { "fi": "Uusikaarlepyy" },
            { "fi": "Uusikaupunki" },
            { "fi": "Uusikirkko" },
            { "fi": "Vaala" },
            { "fi": "Vaasa" },
            { "fi": "Vahto" },
            { "fi": "Vahviala" },
            { "fi": "Valkeakoski" },
            { "fi": "Valkeala" },
            { "fi": "Valkjärvi" },
            { "fi": "Valtimo" },
            { "fi": "Vammala" },
            { "fi": "Vampula" },
            { "fi": "Vanaja" },
            { "fi": "Vantaa" },
            { "fi": "Varkaus" },
            { "fi": "Varpaisjärvi" },
            { "fi": "Vehkalahti" },
            { "fi": "Vehmaa" },
            { "fi": "Vehmersalmi" },
            { "fi": "Velkua" },
            { "fi": "Vesanto" },
            { "fi": "Vesilahti" },
            { "fi": "Veteli" },
            { "fi": "Vieremä" },
            { "fi": "Vihanti" },
            { "fi": "Vihti" },
            { "fi": "Viiala" },
            { "fi": "Viipuri" },
            { "fi": "Viipurin mlk" },
            { "fi": "Viitasaari" },
            { "fi": "Viljakkala" },
            { "fi": "Vilppula" },
            { "fi": "Vimpeli" },
            { "fi": "Virolahti" },
            { "fi": "Virrat" },
            { "fi": "Virtasalmi" },
            { "fi": "Vuoksela" },
            { "fi": "Vuoksenranta" },
            { "fi": "Vuolijoki" },
            { "fi": "Vårdö" },
            { "fi": "Vähäkyrö" },
            { "fi": "Värtsilä" },
            { "fi": "Västanfjärd" },
            { "fi": "Vöyri" },
            { "fi": "Vöyri-Maksamaa" },
            { "fi": "Ylihärmä" },
            { "fi": "Yli-Ii" },
            { "fi": "Ylikiiminki" },
            { "fi": "Ylimarkku" },
            { "fi": "Ylistaro" },
            { "fi": "Ylitornio" },
            { "fi": "Ylivieska" },
            { "fi": "Ylämaa" },
            { "fi": "Yläne" },
            { "fi": "Ylöjärvi" },
            { "fi": "Ypäjä" },
            { "fi": "Äetsä" },
            { "fi": "Ähtäri" },
            { "fi": "Ähtävä" },
            { "fi": "Äyräpää" },
            { "fi": "Äänekosken mlk" },
            { "fi": "Äänekoski" },
            { "fi": "Öja" }
        ]
    },

    "5103c614-1df4-4ffd-a670-30ef78e0a613": {  # education
        "options": [
            { "fi": "peruskoulu (tai vastaava)" },
            { "fi": "ammatillinen koulutus tai lukio" },
            { "fi": "korkeakoulu" },
            { "fi": "jokin muu" }
        ]
    }
}

schedule = {}
items = []

pending_items = {} # key is item ID
current_item_ordinal = 0

latest_item_id = ''

column_numbers = {
    'moduuli': 0,
    'element': 1,
    'itemId': 2,
    'kind': 3,
    'itemType': 4,
    'state': 5,
    'title': 6,
    'body1': 7,
    'body2': 8,
    'url': 9,
    'startTime': 10,
    'endTime': 11,
    'isRecording': 12,
    'metaTitle': 13,
    'otherEntryLabel': 14
}

def find_options(item_id):
    if item_id in metadata_queries:
        return metadata_queries[item_id]['options']
    else:
        return []

def process_row(row, index):
    global current_item_ordinal
    global latest_item_id

    #print(f'row #{index}: {row}')

    element = row['element']
    if element == '':
        logging.info('skipping empty element')
        return

    if element == 'theme':
        logging.info('skipping theme definition')
        return

    item_id = row['itemId']
    state = row['state']
    title = row['title']
    body1 = row['body1']
    body2 = row['body2']
    url = row['url']

    if element == 'schedule':  # cherry pick and move on
        if item_id != '':
            schedule['scheduleId'] = item_id
            latest_item_id = item_id
        if state == 'start':
            if not 'start' in schedule:
                schedule['start'] = {}

        if state == 'finish':
            if not 'finish' in schedule:
                schedule['finish'] = {}

        schedule[state]['title'] = {'fi': title}
        schedule[state]['body1'] = {'fi': body1}
        schedule[state]['body2'] = {'fi': body2}

        image_url = ''
        if url[0].isdigit():
            image_url = yle_cdn_url + url + '.jpg'
        elif url == 'null': # yes, the text 'null'
            image_url = ''
        else:
            image_url = url

        schedule[state]['imageUrl'] = image_url
        return

    kind = row['kind']
    item_type = row['itemType']

    if element == 'item':
        if item_id == '':
            logging.error(f'error: no item ID specified for item, row = {row}')
            return
        latest_item_id = item_id

        if not item_id in pending_items: # need to set up a new item with this ID
            current_item_ordinal += 1
            pending_items[item_id] = {'ordinal': current_item_ordinal, 'itemId': item_id}
            #logging.info(f"added new item with id = '{item_id}', now pending_items = {str(pending_items)}")

        # rows with item ID need to have a state and itemType
        if kind != '':
            pending_items[item_id]['kind'] = kind 
        else:
            logging.error('error: no kind specified for item')
            return
        if item_type != '':
            pending_items[item_id]['itemType'] = item_type
        else:
            logging.error('error: no itemType specified for item')
            return

        if kind == 'prompt':
            pending_items[item_id]['typeId'] = None
            pending_items[item_id]['url'] = None
            pending_items[item_id]['options'] = find_options(item_id)
        else:
            pending_items[item_id]['options'] = []

        if item_type == 'multi-choice' and item_id == NATIVE_LANGUAGE_QUERY_ITEM_ID:
            pending_items[item_id]['otherAnswer'] = { "fi": "Jokin muu kieli" }
            pending_items[item_id]['otherEntryLabel'] = { "fi": "Jos valitsit Muu kieli, kirjoita sen nimi:" }

        if item_type in ['image', 'local-image']:
            pending_items[item_id]['typeId'] = 'image/jpeg'
        elif item_type in ['yle-video', 'video', 'local-video']:
            pending_items[item_id]['typeId'] = 'video/mp4'

        pending_items[item_id]['title'] = {'fi': title}            
        pending_items[item_id]['body1'] = {'fi': body1}
        pending_items[item_id]['body2'] = {'fi': body2}

        url_value = ''
        if url[0].isdigit():
            if item_type == 'yle-video':
                # just use the program ID and let the server decrypt the URL
                url_value = url
            else:
                url_value = yle_cdn_url + url + '.jpg'
        elif url == 'null': # yes, the text 'null'
            url_value = ''
        else:
            url_value = url
        pending_items[item_id]['url'] = url_value
    
        start_time = row['startTime']
        if start_time != '':
            pending_items[item_id]['startTime'] = int(start_time)
        
        end_time = row['endTime']
        if end_time != '':
            pending_items[item_id]['endTime'] = int(end_time)

        is_recording = row['isRecording']
        pending_items[item_id]['isRecording'] = is_recording

        meta_title = row['metaTitle']
        if meta_title != '':
            if meta_title == 'empty':
                pending_items[item_id]['metaTitle'] = {'fi': ''}
            else:
                pending_items[item_id]['metaTitle'] = {'fi': meta_title}

        other_entry_label = row['otherEntryLabel']
        if other_entry_label != '':
            pending_items[item_id]['otherEntryLabel'] = {'fi': other_entry_label}
        return

    if element == 'state':  # attach states to the current item
        if state == '':
            logging.error('error: no name defined for state')
            return

        if not state in pending_items[latest_item_id]:
            pending_items[latest_item_id][state] = {}  # set up a new state

        final_title = {'fi': title}
        if title == 'inherit':
            final_title = pending_items[latest_item_id]['title']
        pending_items[latest_item_id][state]['title'] = final_title

        final_body1 = {'fi': body1}
        if body1 == 'inherit':
            final_body1 = pending_items[latest_item_id]['body1']
        pending_items[latest_item_id][state]['body1'] = final_body1

        final_body2 = {'fi': body2}
        if body2 == 'inherit':
            final_body2 = pending_items[latest_item_id]['body2']
        pending_items[latest_item_id][state]['body2'] = final_body2

        url_value = ''
        if url != '':
            if url[0].isdigit():
                url_value = yle_cdn_url + url + '.jpg'
            elif url == 'null': # yes, the text 'null'
                url_value = ''
            else:
                url_value = url
            pending_items[latest_item_id][state]['imageUrl'] = url_value

def process_rows(rows):
    for i in range(len(rows)):
        process_row(rows[i], i)

def normalized_boolean(s):
    value = False
    if s in ['TRUE', 'true']:
        value = True
    return value

def read_description(filename):
    global current_item
    global items

    all_rows = []

    with open(filename) as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        line_count = 0
        for row in csv_reader:
            if line_count == 0:
                logging.debug(f'Column names: {", ".join(row)}')
            elif line_count == 1:
                logging.debug('skipping line 1')
                line_count += 1
                continue
            else:
                r = {
                    'moduuli': row[column_numbers['moduuli']].strip(),
                    'element': row[column_numbers['element']].strip(),
                    'itemId': row[column_numbers['itemId']].strip(),
                    'kind': row[column_numbers['kind']].strip(),
                    'itemType': row[column_numbers['itemType']].strip(),
                    'state': row[column_numbers['state']].strip(),
                    'title': row[column_numbers['title']].strip(),
                    'body1': row[column_numbers['body1']].strip(),
                    'body2': row[column_numbers['body2']].strip(),
                    'url': row[column_numbers['url']].strip(),
                    'startTime': row[column_numbers['startTime']].strip(),
                    'endTime': row[column_numbers['endTime']].strip(),
                    'isRecording': normalized_boolean(row[column_numbers['isRecording']].strip()),
                    'metaTitle': row[column_numbers['metaTitle']].strip(),
                    'otherEntryLabel': row[column_numbers['otherEntryLabel']].strip()
                }
                all_rows.append(r)
                #print(r)
            line_count += 1

    logging.info(f'Processed {line_count} lines.')
    return all_rows

def report():
    logging.info(f'Schedule has {len(items)} items')
    for item in items:
        print(item)
        continue

        print(f"itemId = {item['itemId']}")
        print(f"{item['kind']} {item['itemType']}")
        if 'title' in item:
            print(f"\ttitle = {item['title']}")
        else:
            print(f"warning: no title set for item (state = {item['state']}")
        if 'isRecording' in item:
            if item['isRecording']:
                states = []
                if 'start' in item:
                    states.append('start')
                if 'recording' in item:
                    states.append('recording')
                if 'finish' in item:
                    states.append('finish')
                print("\tisRecording: " + ' '.join(states))
            else:
                print("\tisRecording: " + str(item['isRecording']).lower())
        print()

def main(arguments):
    current_item_id = ''
    current_item_index = 0

    if len(arguments) < 3:
        print('Need CSV description file and env (dev/prod)')
        sys.exit(-1)
    else:
        environment_name = arguments[2]
        logging.info(f'generating schedule for environment "{environment_name}"')

        filename = arguments[1]
        all_rows = read_description(filename)
        process_rows(all_rows)

        sorted_items = sorted(pending_items.items(), key=lambda x: x[1]['ordinal'])
        #print(sorted_items)

        for item in sorted_items:
            i = item[1]
            del i['ordinal']
            items.append(i)

        #print(f'have {len(items)} items')

        result = {'scheduleId': schedule['scheduleId'], 'items': items}
        if 'start' in schedule:
            result['start'] = schedule['start']
        if 'finish' in schedule:
            result['finish'] = schedule['finish']
        #report()
        print(json.dumps(result, indent=4))

if __name__ == '__main__':
    main(sys.argv)
