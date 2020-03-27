#!/bin/bash

cd data/

wget -O time_series_covid19_confirmed_global.csv.$(date +%F) https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv
wget -O time_series_covid19_deaths_global.csv.$(date +%F) https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv


wget -O cases_country.csv.$(date +%F) https://raw.githubusercontent.com/CSSEGISandData/COVID-19/web-data/data/cases_country.csv
wget -O cases_state.$(date +%F) https://raw.githubusercontent.com/CSSEGISandData/COVID-19/web-data/data/cases_state.csv