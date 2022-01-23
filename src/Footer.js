import React from 'react';

function Footer(){
  return(
    <footer class="bg-blue-500 text-center lg:text-left">
      <div class="container p-6">
        <div>
        <p class="flex justify-center text-white items-center">
          <span class="mr-4">Register for free</span>
          <a href="https://ravinthiranpartheepan.com/home" class="inline-block px-6 py-2 border-2 border-white text-white font-medium text-xs leading-tight uppercase rounded-full hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out">
            MetaVerse!
            </a>
        </p>
        </div>
      </div>
      <div class="text-white text-center p-4 bg-blue-500">
        AZOG COMIC DAO© 2021 Copyright:
      <a class="text-white" href="https://ravinthiranpartheepan.com/home">Ravinthiran Partheepan</a>
      </div>
</footer>
  )
}

export default Footer;
