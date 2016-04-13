import {Injectable} from 'angular2/core';
import {Http, Response} from 'angular2/http';
@Injectable()
export class SearchService {

    constructor(private http:Http) {}

    getAll() {
        return this.http.get('shared/data/menu.json').map((res:Response) => res.json());
    }

    search(q:string) {
        if (!q || q === '*') {
            q = '';
        } else {
            q = q.toLowerCase();
        }
        return this.getAll().map(data => {
            let results = [];
            data.map(item => {
                // check for item in localStorage
                if (localStorage['menu' + item.name]) {
                    item = JSON.parse(localStorage['menu' + item.name]);
                }
                if (JSON.stringify(item).toLowerCase().includes(q)) {
                    results.push(item);
                }
            });
            return results;
        });
    }

    get(name: string) {
        return this.getAll().map(all => {
            if (localStorage['menu' + name]) {
                return JSON.parse(localStorage['menu' + name]);
            }
            return all.find(e => e.name === name);
        });
    }

    save(menu: Menu) {
        localStorage['menu' + menu.name] = JSON.stringify(menu);
    }

}

export class Menu {
    name:  string;
    icon:  string;
    badge: string;
    state: string;
    type:  string;

    constructor(obj?:any) {
        this.name  = obj && obj.name  || null;
        this.icon  = obj && obj.icon  || null;
        this.badge = obj && obj.badge || null;
        this.state = obj && obj.state || null;
        this.type  = obj && obj.type  || null;
    }
}
