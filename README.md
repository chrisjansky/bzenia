# Bzenia

Nové stránky vinařství Bzenia.

### Instalace
- __npm install__
- __bower install__

### Příkazy
- __gulp__ spustí livereload server běžící na localhostu
- __gulp compile__ zkompiluje pracovní verzi pro lokální vývoj (děje se automaticky, pokud běží server)
- __gulp build__ zkompiluje produkční verzi projektu do složky public/
  - v základním režimu zkompiluje pouze jade/, scss/ a js/
  - __--full__ zkompiluje také images/
  - __--uncss__ z výsledného CSS soubory odstraní nepoužité selektory
