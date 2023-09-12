

// S3 이미지
const IMG = `https://syos-test2.s3.ap-northeast-2.amazonaws.com/`;



console.log(typeof post_id,post_id);

async function load() {
  const post_id = document.querySelector('#post_id').innerHTML;
const titleValue = document.querySelector("#title");
const nameValue = document.querySelector("#name");
const imageValue = document.querySelector(".upload-image label");
const carmeraIcon = document.querySelector('.upload-image i');
const carmeraTitle = document.querySelector('.upload-image p');

console.log(imageValue)
let tageNum;
  const res = await axios({
    method: 'POST',
    url: `/board/${post_id}/edit`,
    data: post_id,
  });
  const {category,comment,content,createAt,image,liked,postid,title,updateAt,user_id} = res.data.postsData;
  const nickname = res.data.nickName;
  titleValue.value = title;
  nameValue.value = nickname;
  imageValue.style.backgroundImage = `url('${IMG+image}')`;
  imageValue.style.backgroundPosition = 'center';
  imageValue.style.backgroundSize = 'contain';
  imageValue.style.backgroundRepeat = 'no-repeat';
  carmeraIcon.style.display = 'none';
  carmeraTitle.style.display = 'none';

  nameValue.disabled = true;


  // text-editor 설정
  tinymce.init({
    selector: '#mytextarea',
    setup: function (editor) {
      editor.on('init', function (e) {
        editor.setContent(`${content}`);
      });
    }
  });

  if(category===0){
    document.querySelector(".moden-tag").classList.add("selected")
  }else if(category===1){
    document.querySelector(".natural-tag").classList.add("selected")
  }else if(category===2){
    document.querySelector(".game-tag").classList.add("selected")
  }else if(category===3){
    document.querySelector(".study-tag").classList.add("selected")
  }

}



load()
