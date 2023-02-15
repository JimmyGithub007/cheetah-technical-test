import _ from 'lodash';
import { useMemo, useState } from 'react';
import { BiSortAlt2, BiSortAZ, BiSortZA, BiChevronLeft, BiChevronRight } from 'react-icons/bi';

const DataGrid = (props) => {
    const rowsPerPage = 10;
    const [ order, setOrder ] = useState({ direction: null, id: null });
    const [ pageNum, setPageNum ] = useState(0);

    const handleSort = (orderId) => {
        let direction = 'asc';
        if(order.id === orderId) {
            if(order.direction === 'asc') {
                direction = 'desc'
            } else if(order.direction === 'desc') {
                direction = null;
            }
        }
        setOrder({ direction, id: direction ? orderId : null });
    }

    const disableBtn1 = useMemo(() => {
        if(pageNum === 0) return true;
        return false;
    }, [pageNum]);

    const disableBtn2 = useMemo(() => {
        if(pageNum * rowsPerPage + rowsPerPage >= _.size(props.data)) return true;
        return false;
    }, [pageNum, rowsPerPage, props.data]);

    return (<>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-700 uppercase">
                    <tr>
                        {
                            props.columns.map((col, key) => (
                                <th className={`${col.sortable && "cursor-pointer hover:bg-gray-100"} px-6 py-3`} key={key} onClick={() => { handleSort(col.id) } }>
                                    <span className="flex items-center justify-between">{col.name}
                                        {   col.sortable && ( order.id === col.id && order.direction ?
                                            (order.direction === 'asc' ? <BiSortAZ /> : <BiSortZA />) : 
                                            <BiSortAlt2 />)
                                        }
                                    </span>
                                </th>
                            ))
                        }                    
                    </tr>
                </thead>
                <tbody>
                    {
                        _.orderBy(props.data, [order.id], [order.direction])
                        .slice(pageNum * rowsPerPage, pageNum * rowsPerPage + rowsPerPage)
                        .map((data, k1) => {
                            const k = k1+(pageNum * rowsPerPage);
                            return <tr className="bg-white border-b hover:bg-gray-50" key={k}>
                                {
                                    props.columns.map((col, k2) => (
                                        <td className="px-6 py-4" key={k2}>
                                            { col.render ? col.render(_.get(data, col.id)) : _.get(data, col.id)}
                                        </td>
                                    ))
                                }
                            </tr>
                        })
                    }
                </tbody>
            </table>            
        </div>
        {
            props.pagination && <div className="flex justify-between pt-4">
                <span className="text-gray-400 text-sm">From {(pageNum * rowsPerPage)+(_.size(props.data) > 0 && 1)} to { disableBtn2 ? _.size(props.data) : pageNum * rowsPerPage + rowsPerPage } of {_.size(props.data)}</span>
                <div className="flex gap-2">
                    <button disabled={disableBtn1} className={`${disableBtn1 ? "bg-indigo-200 cursor-not-allowed" : "bg-indigo-500 cursor-pointer hover:bg-indigo-400"} p-1 rounded-full shadow-md`} onClick={() => setPageNum(pageNum-1) }>
                        <BiChevronLeft className="text-2xl text-white" />
                    </button>
                    <button disabled={disableBtn2} className={`${disableBtn2 ? "bg-indigo-200 cursor-not-allowed" : "bg-indigo-500 cursor-pointer hover:bg-indigo-400"} p-1 rounded-full shadow-md`} onClick={() => setPageNum(pageNum+1) }>
                        <BiChevronRight className="text-2xl text-white" />
                    </button>                    
                </div>
            </div>
        }
    </>)
}

export default DataGrid;