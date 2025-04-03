import React from 'react'
// import { RankChart } from './rank-chart';
import { ChartTotal } from './chart-total';
import { ChartRank } from './chart-rank';
import { ChartField } from './chart-field';
import { ChartActive } from './chart-active';
import { ChartInterst } from './chart-interst';

interface MemberChartProps {
  onClose: () => void;
}

const MemberChart: React.FC<MemberChartProps> = () => {
  return (
    <div className='flex flex-col'>
      <div className='flex '>
        <ChartRank />
        <ChartTotal />
        <ChartActive />
      </div>
      <div className='flex '>
        <ChartField />
        <ChartInterst />
      </div>
    </div>
  )
}

export default MemberChart




