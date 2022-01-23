import React from 'react';

function Header(){
  return(
    <nav className="flex items-center justify-between flex-wrap bg-blue-500 p-6">
      <div className="flex items-center flex-shrink-0 text-white mr-6">
        <h1 className="font-semibold text-xl tracking-tight">AZOG DAO</h1>
      </div>
      <div className="block">
        <a className="flex items-center px-3 font-semibold tracking-tight py-2 border rounded text-white border-white-400 hover:text-white hover:border-white" href="https://ravinthiranpartheepan.com/azog/metaverse"> AZOG Metaverse </a>
      </div>
      <div className="block">
        <a className="flex items-center px-3 font-semibold tracking-tight py-2 border rounded text-white border-white-400 hover:text-white hover:border-white" href="https://ravinthiranpartheepan.com"> Ravinthiran Partheepan </a>
      </div>
    </nav>
  )
}

export default Header;
