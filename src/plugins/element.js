import Vue from 'vue'
import { Button, Form, Input, FormItem, Container, Header, Aside, Main, Menu, Submenu,
  MenuItemGroup, MenuItem, Message, Breadcrumb, BreadcrumbItem, Card, Row, Col,
  Table, TableColumn, Switch, Tooltip, Pagination, Dialog, MessageBox } from 'element-ui'

Vue.use(Dialog)
Vue.use(Pagination)
Vue.use(Button)
Vue.use(Form)
Vue.use(Input)
Vue.use(FormItem)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Message)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.prototype.$message = Message.message
Vue.prototype.$confirm = MessageBox.confirm
