# schedule_us_visa_in_canada

###### Preparation

1. Install package in Terminal, input
   `yarn install`
2. Create a new file called `.env`
3. In `.env`, input your account details and information

   ```
   USERNAME={Your username}
   PASSWORD={Your password}
   LOCATION_ID={the number of location id}
   MAX_MONTH={the number of month}
   ```

   LOCATION_ID:

   - Calgary: 89
   - Halifax: 90
   - Montreal: 91
   - Ottawa: 92
   - Quebec City: 93
   - Toronto: 94
   - Vancouver: 95

   MAX_MONTH:
   Input the number of maximum following month

   Example:

   ```
   USERNAME=myemail@gmail.com
   PASSWORD=P@ssw0rd
   LOCATION_ID=94
   MAX_MONTH=6
   ```

###### Start Program in Terminal

- Schedule first interview
  `node schedule.js`

- Reschedule interview
  `node reschedule.js`
