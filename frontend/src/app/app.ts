import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type Post = {
  id: number;
  text: string;
  moderationStatus: string;
  createdAt: string;
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  posts = signal<Post[]>([]);
  text = '';
  loading = false;

  apiUrl = '/api/v1/posts';

  ngOnInit() {
    this.loadPosts();
  }

  async loadPosts() {
    const response = await fetch(this.apiUrl);
    const data = await response.json();
    this.posts.set(data);
  }

  async createPost() {
    if (!this.text.trim()) return;

    this.loading = true;

    await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: this.text }),
    });

    this.text = '';
    this.loading = false;
    await this.loadPosts();
  }
}