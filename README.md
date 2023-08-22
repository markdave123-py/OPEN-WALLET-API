# OPEN-WALLET-API
An API designed to perform transactions and download transactions as PDFs.
Users can create an account and login using there email and password
Users that are logged in can create a wallet, get all the wallets they have created, and get one wallet when they provide the ID of the wallet in question.
Wallets have fields like id, amount, currency, userid (the id of the user that created the wallet), createdAt  and updated at.
A user can deposit, transfer into a wallet with respect to the wallet currency.
Only the User that created the wallet can get the wallet info, withdraw from the wallet and get the transactions performed in the wallet.
User can downlaod a pdf of all the trasactions performed in the wallet.
