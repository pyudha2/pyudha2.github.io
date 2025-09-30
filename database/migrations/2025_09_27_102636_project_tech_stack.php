<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_tech_stack', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->onDelete('cascade');
            $table->foreignId('tech_stack_id')->constrained()->onDelete('cascade');
            $table->timestamps();

            $table->unique(['project_id', 'tech_stack_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_tech_stack');
    }
};
