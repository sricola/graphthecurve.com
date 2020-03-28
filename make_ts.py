import pandas as pd
import numpy as np
import math

# Read all the files
dfConfirmedGlobal = pd.read_csv(r'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv')
dfDeathsGlobal = pd.read_csv(r'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv')

baseURLFormat = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/{}.csv'
filePaths = [baseURLFormat.format(d.strftime('%m-%d-%Y')) for d in pd.date_range('2020-03-23', pd.to_datetime('today')).tolist()]

df_from_each_file = []
for f in filePaths:
    try:        
        df_from_each_file.append(pd.read_csv(f))
    except:
        break
dfByDay = pd.concat(df_from_each_file, ignore_index=True)

dfConfirmedUS = pd.read_csv(r'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/archived_data/archived_time_series/time_series_19-covid-Confirmed_archived_0325.csv')
dfConfirmedUS = dfConfirmedUS[dfConfirmedUS.columns[:-1]]
dfDeathsUS = pd.read_csv(r'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/archived_data/archived_time_series/time_series_19-covid-Deaths_archived_0325.csv')
dfDeathsUS = dfDeathsUS[dfDeathsUS.columns[:-1]]

# Get US data only
dfConfirmedUS = dfConfirmedUS [(dfConfirmedUS['Country/Region'] == 'US') & (dfConfirmedUS['Province/State'] != 'US')]
dfDeathsUS = dfDeathsUS [(dfDeathsUS['Country/Region'] == 'US') & (dfDeathsUS['Province/State'] != 'US')]

# Merge columns after 3/23 when the timeseries broke
dfByDayState = dfByDay[dfByDay.Country_Region == 'US'].groupby(['Last_Update', 'Province_State']).agg({'Confirmed':sum, 'Deaths':sum}).unstack(level=0)
dfByDayStateConfirmed = dfByDayState[['Confirmed']]
dfByDayStateConfirmed.columns = dfByDayStateConfirmed.columns.droplevel().map(lambda x: pd.to_datetime(x).strftime('%-m/%d/%y'))

dfConfirmedUSStates = dfConfirmedUS.merge(dfByDayStateConfirmed, how='left', left_on='Province/State', right_on='Province_State')
dfConfirmedUSStates[dfConfirmedUSStates.columns[4:]] = dfConfirmedUSStates[dfConfirmedUSStates.columns[4:]].fillna(0).astype(np.int64)
dfConfirmedUSStates = dfConfirmedUSStates.sort_values(dfConfirmedUSStates.columns[-1], ascending = False)

dfByDayStateDeaths = dfByDayState[['Deaths']]
dfByDayStateDeaths.columns = dfByDayStateDeaths.columns.droplevel().map(lambda x: pd.to_datetime(x).strftime('%#m/%d/%y'))
dfDeathsUSStates = dfDeathsUS.merge(dfByDayStateDeaths, how='left', left_on='Province/State', right_on='Province_State')
dfDeathsUSStates[dfDeathsUSStates.columns[4:]] = dfDeathsUSStates[dfDeathsUSStates.columns[4:]].fillna(0).astype(np.int64)
dfDeathsUSStates = dfDeathsUSStates.sort_values(dfDeathsUSStates.columns[-1], ascending = False)
dfConfirmedUSStates.to_csv('deaths_us_states.csv', index=False)

# Use dfConfirmedUSStates and dfDeathsUSStates