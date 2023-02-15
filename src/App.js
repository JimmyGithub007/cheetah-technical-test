import { useEffect, useState } from "react";
import { AiFillGithub } from 'react-icons/ai';
import Data from "./api/Data";
import DataGrid from "./components/DataGrid";

const columns = [
  { id: "pair", name: "Pair", sortable: true },
  { id: "tags", name: "Tags", sortable: true,
    render: data => {
      return <div className="flex flex-wrap gap-1">{data.map((value, key) => (
        <span key={key} className="bg-indigo-400 px-2 py-1 rounded-xl shadow-md text-xs text-white">{value}</span>
      ))}</div>
    }
  },
];

function App() {
  const [ data, setData ] = useState([]);

  useEffect(() => {
    const getAPI = async () => {
      try {
        const resp = await Data();
        const recipients = resp.recipients;

        const pairTags = [];
        recipients.forEach((v1, k1) => {
          recipients.filter((v2, k2) => k2 > k1).forEach(v2 => {
            let commonTags = [];
            v1.tags.forEach(v3 => {
              if(v2.tags.includes(v3)) {
                commonTags.push(v3);
              }
            })
            if(commonTags.length >= 2) {
              const pair = [v1.name, v2.name].sort().join(", ");
              const tags = commonTags.sort().join(", ");
              pairTags.push({ pair, tags: commonTags });
              console.log(pair+" - ["+tags+"]")
            }
          })
        })
        setData(pairTags);
      } catch (e) {
        console.log(e);
      }
    }

    getAPI();
  }, [])

  return (<div className="bg-gray-100 min-h-screen sm:px-8">
    <div className="flex items-center justify-between p-4 text-gray-700">
      <span className="font-bold text-md sm:text-xl">Cheetah Digital Home Assessment</span>
      <a className="duration-300 text-2xl hover: cursor-pointer hover:text-gray-900" href={process.env.REACT_APP_GITHUB_URL}><AiFillGithub /></a>
    </div>
    <div className="bg-white border-2 border-gray-100 p-4 rounded-lg shadow-md">
      <DataGrid columns={columns} data={data} pagination={true} />
    </div>
  </div>);
}

export default App;
