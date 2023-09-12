//S3 이미지 경로
const IMG = `https://syos-test2.s3.ap-northeast-2.amazonaws.com/`

// 페이지 렌더될 때 데이터 가져오기
const fetchData = async () => {
  const res = await axios({
    method: 'POST',
    url: '/board/all',
  });
  console.log(res);

  // 게시물 생성
  for (let i = 0; i < res.data.length; i++) {
    const postCreate = document.createElement('div');
    const container = document.getElementById('mood-itemwrap');
    postCreate.classList.add('item-box');

    // 게시물과 post_id 연결
    postCreate.addEventListener('click', () => {
      location.href = `/board/${res.data[i].post_id}`;
    });

    postCreate.innerHTML = `
            <img src="${IMG + res.data[i].image}" />
            <div class="post-box" >
                <div class="text-box">
                    <span> ${res.data[i].title}</span>
                </div>

                <div class="res-box">
                    <div class="heart-box">
                        <i class="fa-solid fa-heart" style="color: #f00000;"></i>                            
                        <p class="liked">${res.data[i].liked}</p>
                    </div>
                    <div class="comment-box">
                        <i class="fa-regular fa-comment" style="color: #000000;"></i>
                        <p class="comment">${res.data[i].comment}</p>
                    </div>
                </div>
            </div>`;

    container.appendChild(postCreate);
  }
};

fetchData();

// 버튼 선택할 때마다 axios로 값 보내주기
const filterButtons = document.querySelectorAll('input[name="filter"]');
filterButtons.forEach((filter) => {
  filter.addEventListener('change', async () => {
    const posts = await axios({
      method: 'POST',
      url: '/board/filter',
      data: { filter: filter.value },
    });
    console.log(posts);
    const container = document.getElementById('mood-itemwrap');
    container.innerHTML = ``;
    // 게시물 생성
    for (let i = 0; i < posts.data.length; i++) {
        console.log(i);
        const postCreate = document.createElement('div');
        postCreate.classList.add('item-box');
        // 게시물과 post_id 연결
        postCreate.addEventListener('click', () => {
          location.href = `/board/${posts.data[i].post_id}`;
        });
    
        postCreate.innerHTML = `
                <img src="${IMG + posts.data[i].image}" />
                <div class="post-box" >
                    <div class="text-box">
                        <span> This is title: ${posts.data[i].title}</span>
                    </div>
    
                    <div class="res-box">
                        <div class="heart-box">
                            <i class="fa-solid fa-heart" style="color: #f00000;"></i>                            
                            <p class="liked">${posts.data[i].liked}</p>
                        </div>
                        <div class="comment-box">
                            <i class="fa-regular fa-comment" style="color: #000000;"></i>
                            <p class="comment">${posts.data[i].comment}</p>
                        </div>
                    </div>
                </div>`;
    
        container.appendChild(postCreate);
      }
    });
});
