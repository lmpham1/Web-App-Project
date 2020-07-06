const puppeteer = require("puppeteer");

var songsArray;




module.exports = {
    initialize: () =>{
        (async()=>{
            console.log("Run!");
            const browser = await puppeteer.launch({
                headless: true
            });
            try{

            //Nhaccuatui
            const page = await browser.newPage();
            await page.goto(`https://www.nhaccuatui.com/bai-hat/top-20.nhac-viet.html`, {
                timeout: 3000000
            });
            console.log("page loaded!");
            songsArray = await page.evaluate(() =>{
                let index1 = 0;
                let songs = document.getElementsByClassName("list_show_chart")[0].getElementsByTagName("LI");
                songs = [...songs];
                let results = songs.map(song => ({
                    id: index1++,
                    title: song.getElementsByClassName("name_song")[0].innerHTML,
                    artist_list: (() =>{
                        let artists = [];
                        artistList = Array.from(song.getElementsByClassName("name_singer"));
                        for (var j = 0; j < artistList.length; ++j){
                            artists.push(artistList[j].innerHTML);
                        };
                        return artists;
                    })(),
                    charting: {
                        direction: song.getElementsByClassName("chart_lw")[0].classList[1],
                        positions_shifted: song.getElementsByClassName("chart_lw")[0].getElementsByTagName("P")[0].innerHTML
                    },
                    url: song.getElementsByClassName("name_song")[0].href
                }));
                return results;
            })

            //Zing MP3
            const page2 = await browser.newPage();
            //await page2.on('console', consoleObj => console.log(consoleObj.text()));
            await page2.goto(`https://mp3.zing.vn/zing-chart/bai-hat.html`, {
                timeout: 3000000
            });
            console.log("page 2 loaded!");
            
            
            //let debugMessage = [];
            songsArray = songsArray.concat(await page2.evaluate(()=>{
                let index2 = 100;
                let songs = document.getElementById("list-item").querySelectorAll("li.fn-item");
                //console.log(songs);
                songs = [...songs];
                
                //console.log(songs);
                let results = songs.map(song => ({
                    
                    id: index2++,
                    title: song.getElementsByClassName("fn-name fn-link _trackLink")[0].innerHTML.trim(),
                    artist_list: (() =>{
                            let artistList = song.getElementsByClassName("sub-title")[0].getElementsByTagName("A");
                            artistList = [...artistList];
                            let artists = [];
                            for (var j = 0; j < artistList.length; ++j){
                                artists.push(artistList[j].innerHTML);
                            }
                            return artists;
                    })(),
                    charting: {
                        direction: (() => {
                            let text = song.getElementsByClassName("label-rank-status")[0];
                            if (text == null){
                                text = "";
                            }
                            else{
                                text = text.getElementsByTagName("SPAN")[0].classList[1];
                                if (text.includes("up"))
                                    text = "upchart";
                                else if (text.includes("down"))
                                    text = "downchart"
                                else text = "nonechart";
                            }
                            return text;
                        })(),
                        positions_shifted: song.getElementsByClassName("label-rank-status")[0].innerText
                    },
                    url: song.getElementsByClassName("_trackLink")[0].href
            }));
                return results;
            }));
            //console.log(songsArray2);
            //songsArray.concat(songsArray2);
            //console.log("merge!");


        }catch(err){
            console.log(err);
        }finally{
            //console.log(debugMessage);
            console.log(songsArray);
            await browser.close();
        }
        })();
    },
    songsGetAll: () => {
        return new Promise((resolve, reject) =>{
            if (songsArray.length > 0)
                resolve(songsArray);
            else
                reject("no songs available");
        })
    },
    songsGetByName: (name) =>{
        return new Promise((resolve, reject) =>{
            let results = [];
            //console.log(songsArray)
            for (let i = 0; i < songsArray.length; ++i) {
                //console.log(songsArray[i].title);
                let search = "";
                search = xoa_dau(songsArray[i].title);;
                if (search.includes(name))
                    results.push(songsArray[i]);
            }
            if (results.length > 0)
                resolve(results);
            else reject("No songs with the title \"" + name + "\" found!");
        })
    }
};

function xoa_dau(str) {
	str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
	str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
	str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
	str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
	str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
	str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
	str = str.replace(/đ/g, "d");
	str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
	str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
	str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
	str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
	str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
	str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
	str = str.replace(/Đ/g, "D");
	return str;
}