import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AppContext } from '../store/AppContext';
import { Pie } from 'react-chartjs-2';
import '../styles/statistics.css';

const Statistics = ()=>{
    const { getCsrfToken } = useContext(AppContext);
    const [statsData,setStatsData] = useState({});

	const data_amount = {
        labels: [
          'Wydatki',
          'Przychody',
          'Przelewy'
        ],
        datasets: [{
          label: 'My First Dataset',
          data: [statsData.expense_number, statsData.income_number, statsData.transfer_number],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
          ],
          hoverOffset: 4
        }]
      };
	const data_value = {
        labels: [
          'Wydatki',
          'Przychody',
          'Przelewy'
        ],
        datasets: [{
          label: 'My First Dataset',
          data: [statsData.expense_value, statsData.income_value, statsData.transfer_value],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
          ],
          hoverOffset: 4
        }]
      };

    useEffect(() => {
		const fetchStats = async () => {
			const res = await api.get('/api/v1/stats/get', {
				headers: {
					'X-CSRF-TOKEN': `${getCsrfToken()}`,
					'Content-Type': 'application/json',
				},
			});
			setStatsData(res.data);
			console.log(res.data);
		};

		fetchStats();
	}, []);

  const showCurrentMonthAndYear=()=>{
    const today=new Date();
    const year=today.getFullYear();
    const month = today.getMonth();
    let monthName=null;
    switch(month){
      case 0:
        monthName="styczeń";
        break;
      case 1:
        monthName="luty";
        break;
      case 2:
        monthName="marzec";
        break;
      case 3:
        monthName="kwiecień";
        break;
      case 4:
        monthName="maj";
        break;
      case 5:
        monthName="czerwiec";
        break;
      case 6:
        monthName="lipiec";
        break;
      case 7:
        monthName="sierpień";
        break;
      case 8:
        monthName="wrzesień";
        break;
      case 9:
        monthName="październik";
        break;
      case 10:
        monthName="listopad";
        break;
      default:
        monthName="grudzień"
    }
    return monthName+" "+year;

  }

    return(
		<>
      <h1 className="stats-header">Statystyki z obcecnego miesiąca tj. <span>{showCurrentMonthAndYear()}</span></h1>
    	<div className="stats-data-container">
            <h2>W tym miesiącu dodałeś już {statsData.number} transakcji</h2>
            <table>
                <thead>
                <tr>
                    <th></th>
                    <th>Ilość typów transakcji</th>
                    <th>Procentowa ilość typów transakcji</th>
                    <th>Wartość typów transakcji</th>
                </tr>
                </thead>
                <tbody>
                    <tr>
                        <th>Przychody</th>
                        <td>{statsData.income_number}</td>
                        <td>~{((statsData.income_number*100)/statsData.number).toFixed(2)}%</td>
                        <td>{statsData.income_value} zł</td>
                    </tr>
                    <tr>
                        <th>Wydatki</th>
                        <td>{statsData.expense_number}</td>
                        <td>~{((statsData.expense_number*100)/statsData.number).toFixed(2)}%</td>
                        <td>{statsData.expense_value} zł</td>
                    </tr>
                    <tr>
                        <th>Przelewy</th>
                        <td>{statsData.transfer_number}</td>
                        <td>~{((statsData.transfer_number*100)/statsData.number).toFixed(2)}%</td>
                        <td>{statsData.transfer_value} zł</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div className="part-best-and-chart">
            <div className="part-best">
                <p>
                    Ilośc dodanych przez Ciebie typów transakcji zaprezentowana na diagramie kołowym
                </p>
            </div>
            <div className="part-chart">
                <Pie data={data_amount}/>
                <p>Diagram kołowy ilości dodanych typów transakcji</p>
            </div>
        </div>
        <div className="part-best-and-chart">
            <div className="part-chart">
                <Pie data={data_value}/>
            </div>
            <div className="part-best">
            </div>
        </div>
		</>
	)
}

export default Statistics;