export class User {
    constructor(
        public id: string,
        public email: string,
        private _token: string,
        private tokenExpirationDate: Date
    ) {}

    get token() {
        // Comprobamos si el token esta expirado
        if (!this.tokenExpirationDate || this.tokenExpirationDate <= new Date()) {
            return null;
        }

        return this._token;
    }
}