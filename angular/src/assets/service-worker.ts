import { Injectable } from 'angular2/core';

@Injectable()
export class CollectionService {

  // our handler for wp-api client.
  collection;
  posts:Array<PostResponse> = [];

  constructor() {
  }

  fetchPosts(perPage:number, page:number, type:string) {

    //initialize query parameters in data
    this.collection = new window['wp']['api']['collections']['Posts']();
    this.collection.fetch({
      data: {
        _embed: true,
        page: page,
        per_page: perPage
      }
    }).done((posts) => {
      this.InitializeResponse(posts);
    });
  }

  fetchMore() {
    this.collection.more().done((posts) => {
      this.InitializeResponse(posts);
    });
  }

  InitializeResponse(posts) {
    for (var post of posts) {
      /* due to the weird attributes names provided by the official wp rest api v2.
       post._embedded['https://api.w.org/term'][0] : represents the categories of the posts.
       post._embedded['https://api.w.org/term'][1] : represents the tags of the posts.
       post._embedded['https://api.w.org/featuredmedia'][0] : represents the featured image.*/

      var postResponse:PostResponse;
      postResponse = <any>post;
      postResponse.postsCats = post._embedded['https://api.w.org/term'][0];
      postResponse.postsCats = post._embedded['https://api.w.org/term'][1];

      /* check if the post has featured image && check if it has a medium size */
      if (post._embedded.hasOwnProperty('https://api.w.org/featuredmedia')
        && post._embedded['https://api.w.org/featuredmedia'][0].media_details.sizes.hasOwnProperty('medium')) {

        postResponse.featuredImage = post._embedded['https://api.w.org/featuredmedia'][0].media_details.sizes.medium.source_url;
      }
      this.posts.push(postResponse);
    }
  }
}

export interface PostResponse{
  /*
  our PostResponse will already contain all post attributes,
  but we need to add extra attributes to the root to make it
  easy to call from the Post template.
   */
  featuredImage : string;
  postsCats: Array<any>;
  postsTags: Array<any>;
}

@Injectable()
export class SingleService {

  // our handler for wp-api client.
  collection;
  posts:Array<PostResponse> = [];

  constructor() {
  }
}



//import { Http } from 'angular2/http';
//import { Injectable } from 'angular2/core';
//import { Subject } from 'rxjs/Subject';
//import { Observable } from 'rxjs/Observable';
//
//@Injectable()
//export class Categories {
//    baseURL = 'http://localhost/wptest/api';
//    constructor(private http: Http) {
//    }
//    loadCats() {
//         var query = this.baseURL + '/get_category_index';
//         return this.http.get(query).map(res => res.json());
//    }
//}
//@Injectable()
//export class Tags {
//    baseURL = 'http://localhost/wptest/api';
//    constructor(private http: Http) {
//    }
//    loadTags() {
//         var query = this.baseURL + '/get_tag_index';
//         return this.http.get(query).map(res => res.json());
//    }
//}
//@Injectable()
//export class Pages {
//    baseURL = 'http://localhost/wptest/api';
//    constructor(private http: Http) {
//    }
//    loadPages() {
//         var query = this.baseURL + '/get_page_index';
//         return this.http.get(query).map(res => res.json());
//    }
//}
//
//@Injectable()
//export class Page {
//    baseURL: string = 'http://localhost/wptest/api';
//    constructor(private http: Http) {
//    }
//    loadPage(name) {
//        var query = this.baseURL + '/get_page/?page_slug=' + name;
//        return this.http.get(query).map(res => res.json());
//    }
//}
//
//@Injectable()
//export class SinglePost {
//    baseURL: string = 'http://localhost/wptest/api';
//    constructor(private http: Http) {
//    }
//    loadPost(name, post_type?) {
//        var query = this.baseURL + '/get_post?post_slug=' + name;
//        if (post_type) query += '&post_type=' + post_type;
//        return this.http.get(query).map(res => res.json());
//    }
//}
//
//@Injectable()
//export class Posts {
//    _load = new Subject<any>();
//    pagedIn: number = 1;
//    posts_per_pageIn: number = 6;
//    typeIn: string;
//    loadedPostCount;
//    totalPostCount;
//    completed;
//    posts;
//    constructor(public http: Http) {
//        this.initialize();
//    }
//    initialize() {
//        var currentPage = this._load
//            .scan(() => this.pagedIn++);
//
//        var postResponses = currentPage
//            .flatMap(() => this.fetchPosts())
//            .share();
//
//        this.posts = postResponses
//            .scan((allPosts, newPosts) => allPosts['concat'](newPosts), []);
//
//        this.loadedPostCount = this.posts.map(p => p.length);
//    }
//    fetchPosts() {
//        var query = 'http://localhost/wptest/wp-json/wp/v2/posts?&_embed&';
//        var params = [];
//        ['filter[posts_per_page]', 'filter[paged]', 'filter[post_type]'].forEach((name) => {
//            console.log(this[name.match(/\[(.*?)\]/)[1] + 'In']);
//             if (this[name.match(/\[(.*?)\]/)[1] + 'In']) params.push(name + '=' + this[name.match(/\[(.*?)\]/)[1] + 'In']);
//            });
//        query += params.join('&');
//        return this.http.get(query).map(res => res.json());
//    }
//    loadMore() {
//        this._load.next('');
//    }
//}
//
//@Injectable()
//export class SearchPosts extends Posts {
//    query: string = 'http://localhost/wptest/api/get_search_results/?';
//    _load = new Subject();
//    searchIn: string;
//    constructor(http: Http) {
//        super(http);
//        this.initialize();
//    }
//    initialize() {
//        super.initialize();
//    }
//    fetchPosts() {
//        var params = [];
//        ['count', 'page', 'post_type', 'search'].forEach((name) => {
//            if (this[name + 'In']) params.push(name + '=' + this[name + 'In']); });
//        this.query += params.join('&');
//        return this.http.get(this.query).map(res => res.json());
//    }
//}
//
//@Injectable()
//export class CatPosts extends Posts {
//    query: string = 'http://localhost/wptest/api/core/get_category_posts/?';
//    _load = new Subject();
//    slugIn: string;             //category slug
//    constructor(http: Http) {
//        super(http);
//        this.initialize();
//    }
//    initialize() {
//        super.initialize();
//    }
//    fetchPosts() {
//        var params = [];
//        ['count', 'page', 'post_type', 'slug'].forEach((name) => {
//            if (this[name + 'In']) params.push(name + '=' + this[name + 'In']); });
//        this.query += params.join('&');
//        return this.http.get(this.query).map(res => res.json());
//    }
//}
//
//@Injectable()
//export class TagPosts extends Posts {
//    query: string = 'http://localhost/wptest/api/get_tag_posts/?';
//    _load = new Subject();
//    tag_slugIn: string;             //category slug
//    constructor(http: Http) {
//        super(http);
//        this.initialize();
//    }
//    initialize() {
//        super.initialize();
//    }
//    fetchPosts() {
//        var params = [];
//        ['count', 'page', 'post_type', 'tag_slug'].forEach((name) => {
//            if (this[name + 'In']) params.push(name + '=' + this[name + 'In']); });
//        this.query += params.join('&');
//        return this.http.get(this.query).map(res => res.json());
//    }
//}