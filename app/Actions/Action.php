<?php

namespace App\Actions;

use Illuminate\Database\Eloquent\Model;

abstract class Action
{
    abstract public function handle(): Model|string|bool|null;
}
