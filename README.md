## Exchange Rate Provider ##
A currency converter built with Angular and .NET. This application fetches real-time exchange rates from the Czech National Bank (CNB) and allows for flexible, two-way conversions.

### Features ###
- Real-Time Data: Fetches daily exchange rates directly from the Czech National Bank.
- Two-Way Conversion: Select any source and target currency (defaults to CZK → USD).
- Interactive Table: View all available rates in a table.
- Dynamic Sorting: Clicking a currency in the table automatically pins it to the top and updates the converter.

### Installation & Setup ###
1. Clone the repository
```bash
https://github.com/jemimahy/ExchangeRateProvider.git
cd ExchangeRateProvider
```
2. Run the Backend (.NET)
```bash
cd backend
dotnet restore
dotnet run
```
3. Run the Frontend (Angular)
```bash
cd ../frontend
npm install
ng serve
```

### Technical Decisions ###
- Used Angular Signals for the UI state (amount, selectedCurrency) to ensure the DOM only updates exactly where needed without heavy re-renders.
- The conversion math and table sorting are handled via computed() signals to keep the logic declarative and bug-free.
- Manually injected CZK into the frontend rate list to allow users to switch between "Czech as Source" and "Czech as Target" seamlessly.
